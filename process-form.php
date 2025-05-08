<?php
/**
 * Contact Form Processing Script
 * For Brian Guvava's Portfolio Website
 */

// Require PHPMailer
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

// Start session for CSRF protection
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Set headers to return JSON response
header('Content-Type: application/json');

// Initialize response array
$response = [
    'success' => false,
    'message' => 'An error occurred while processing your request.'
];

// Function to log errors
function logError($message, $details = null) {
    $errorLog = 'logs/contact_form_' . date('Y-m-d') . '.log';
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[{$timestamp}] ERROR: {$message}" . PHP_EOL;
    
    if ($details) {
        $logMessage .= "Details: " . print_r($details, true) . PHP_EOL;
    }
    
    // Ensure logs directory exists
    if (!is_dir('logs')) {
        mkdir('logs', 0755, true);
    }
    
    file_put_contents($errorLog, $logMessage, FILE_APPEND);
}

// Add rate limiting to prevent abuse
function checkRateLimit() {
    $maxSubmissions = 5; // Maximum submissions allowed
    $timeWindow = 3600; // Time window in seconds (1 hour)
    $ipAddress = $_SERVER['REMOTE_ADDR'];
    
    // Create logs directory if it doesn't exist
    if (!is_dir('logs')) {
        mkdir('logs', 0755, true);
    }
    
    $rateFile = 'logs/rate_limit.json';
    
    // Initialize or read rate limiting data
    if (file_exists($rateFile)) {
        $rateData = json_decode(file_get_contents($rateFile), true);
    } else {
        $rateData = [];
    }
    
    // Clean up old entries
    $currentTime = time();
    foreach ($rateData as $ip => $data) {
        if ($currentTime - $data['timestamp'] > $timeWindow) {
            unset($rateData[$ip]);
        }
    }
    
    // Check if IP exists in rate data
    if (isset($rateData[$ipAddress])) {
        $data = $rateData[$ipAddress];
        
        // If within time window, check count
        if ($currentTime - $data['timestamp'] <= $timeWindow) {
            if ($data['count'] >= $maxSubmissions) {
                // Rate limit exceeded
                logError('Rate limit exceeded', ['IP' => $ipAddress, 'count' => $data['count']]);
                return false;
            }
            
            // Increment count
            $rateData[$ipAddress]['count']++;
        } else {
            // Reset if outside time window
            $rateData[$ipAddress] = [
                'timestamp' => $currentTime,
                'count' => 1
            ];
        }
    } else {
        // First submission from this IP
        $rateData[$ipAddress] = [
            'timestamp' => $currentTime,
            'count' => 1
        ];
    }
    
    // Save updated rate data
    file_put_contents($rateFile, json_encode($rateData));
    return true;
}

// Check if the form was submitted via POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Check rate limiting
    if (!checkRateLimit()) {
        $response['message'] = 'Too many submissions. Please try again later.';
        echo json_encode($response);
        exit;
    }
    
    // Verify CSRF token
    if (!isset($_POST['csrf_token']) || !isset($_SESSION['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        $response['message'] = 'Invalid form submission.';
        logError('CSRF token validation failed', ['provided' => $_POST['csrf_token'] ?? 'none', 'expected' => $_SESSION['csrf_token'] ?? 'none']);
        echo json_encode($response);
        exit;
    }
    
    // Check for honeypot field (anti-spam)
    if (!empty($_POST['website'])) {
        // This is likely a bot submission - silently fail
        logError('Honeypot trap triggered', ['IP' => $_SERVER['REMOTE_ADDR']]);
        echo json_encode($response);
        exit;
    }
    
    // Check submission time (anti-spam)
    $formTime = isset($_POST['form_time']) ? (int)$_POST['form_time'] : 0;
    $currentTime = time() * 1000; // Convert to milliseconds to match JavaScript
    $elapsedTime = ($currentTime - $formTime) / 1000; // in seconds
    
    if ($elapsedTime < 2) {
        // Submission was too quick, likely automated
        logError('Timing trap triggered', ['elapsed' => $elapsedTime, 'IP' => $_SERVER['REMOTE_ADDR']]);
        echo json_encode($response);
        exit;
    }
    
    // Validate required fields
    $requiredFields = ['name', 'email', 'subject', 'message'];
    $missingFields = [];
    
    foreach ($requiredFields as $field) {
        if (empty($_POST[$field])) {
            $missingFields[] = $field;
        }
    }
    
    if (!empty($missingFields)) {
        $response['message'] = 'Please fill in all required fields: ' . implode(', ', $missingFields);
        echo json_encode($response);
        exit;
    }
    
    // Sanitize and validate input data
    $name = htmlspecialchars(trim($_POST['name']), ENT_QUOTES, 'UTF-8');
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $subject = htmlspecialchars(trim($_POST['subject']), ENT_QUOTES, 'UTF-8');
    $message = htmlspecialchars(trim($_POST['message']), ENT_QUOTES, 'UTF-8');
    
    // Additional validation
    if (strlen($name) > 100) {
        $response['message'] = 'Name is too long (maximum 100 characters).';
        echo json_encode($response);
        exit;
    }
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Please enter a valid email address.';
        echo json_encode($response);
        exit;
    }
    
    if (strlen($subject) > 200) {
        $response['message'] = 'Subject is too long (maximum 200 characters).';
        echo json_encode($response);
        exit;
    }
    
    // Validate message length
    if (strlen($message) < 10) {
        $response['message'] = 'Your message should be at least 10 characters.';
        echo json_encode($response);
        exit;
    }
    
    if (strlen($message) > 5000) {
        $response['message'] = 'Your message is too long (maximum 5000 characters).';
        echo json_encode($response);
        exit;
    }
    
    // Create a new PHPMailer instance
    $mail = new PHPMailer(true);
    
    try {
        // Load email configuration from config file
        $emailConfig = include 'config/email-config.php';
        
        // Server settings
        if ($emailConfig['smtp_enabled']) {
            $mail->isSMTP();
            $mail->Host = $emailConfig['smtp_host'];
            $mail->SMTPAuth = true;
            $mail->Username = $emailConfig['smtp_username'];
            $mail->Password = $emailConfig['smtp_password'];
            $mail->SMTPSecure = $emailConfig['smtp_secure'];
            $mail->Port = $emailConfig['smtp_port'];
        }
        
        // Recipients
        $mail->setFrom($emailConfig['from_email'], $emailConfig['from_name']);
        $mail->addAddress($emailConfig['to_email'], $emailConfig['to_name']);
        $mail->addReplyTo($email, $name);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = "Portfolio Contact: $subject";
        
        // Prepare email body
        $emailBody = "
        <html>
        <head>
            <title>New Contact Form Submission</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                h2 { color: #2563eb; }
                .info { margin-bottom: 20px; }
                .label { font-weight: bold; }
                .message { background-color: #f9f9f9; padding: 15px; border-left: 3px solid #2563eb; }
                .footer { margin-top: 30px; font-size: 12px; color: #777; }
            </style>
        </head>
        <body>
            <div class='container'>
                <h2>New Contact Form Submission</h2>
                <div class='info'>
                    <p><span class='label'>Name:</span> $name</p>
                    <p><span class='label'>Email:</span> $email</p>
                    <p><span class='label'>Subject:</span> $subject</p>
                </div>
                <div class='message'>
                    <p><span class='label'>Message:</span></p>
                    <p>" . nl2br($message) . "</p>
                </div>
                <div class='footer'>
                    <p>This email was sent from the contact form on Brian Guvava's Portfolio Website.</p>
                    <p>IP Address: " . $_SERVER['REMOTE_ADDR'] . "</p>
                    <p>Date: " . date('Y-m-d H:i:s') . "</p>
                </div>
            </div>
        </body>
        </html>
        ";
        
        $mail->Body = $emailBody;
        $mail->AltBody = "Name: $name\nEmail: $email\nSubject: $subject\n\nMessage:\n$message";
        
        // Send the email
        $mail->send();
        
        // Successful email sent
        $response['success'] = true;
        $response['message'] = 'Your message has been sent successfully. I\'ll get back to you soon!';
        
        // Log successful submission
        logError('Contact form submission successful', ['name' => $name, 'email' => $email]);
    } catch (Exception $e) {
        // Log the error
        logError('Email sending failed', ['error' => $mail->ErrorInfo]);
        $response['message'] = 'Failed to send your message. Please try again or contact directly via email.';
    }
}

// Regenerate CSRF token for next submission
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));
// Include the new token in the response
$response['csrf_token'] = $_SESSION['csrf_token'];

// Return the JSON response
echo json_encode($response);
