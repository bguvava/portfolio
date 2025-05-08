/**
 * Contact Form Validation and Submission
 * For Brian Guvava's Portfolio Website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Set the form timestamp when the page loads
    document.getElementById('formTime').value = Date.now();
    
    // Get the contact form element
    const contactForm = document.getElementById('contactForm');
    
    // Add submit event listener to the form
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            // Prevent the default form submission
            event.preventDefault();
            
            // Validate the form
            if (validateForm()) {
                // If validation passes, check for spam
                if (!isSpam()) {
                    // Submit the form via AJAX
                    submitForm();
                } else {
                    console.log('Spam submission detected');
                    // Silently reject spam submissions without notifying the user
                }
            }
        });
    }
    
    /**
     * Validate the form fields
     * @return {boolean} True if all validations pass, false otherwise
     */
    function validateForm() {
        let isValid = true;
        
        // Get form field values
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');
        
        // Reset previous validation states
        resetValidation([name, email, subject, message]);
        
        // Validate name (required)
        if (!name.value.trim()) {
            showError(name, 'Please enter your name');
            isValid = false;
        } else if (name.value.trim().length > 100) {
            showError(name, 'Your name is too long (maximum 100 characters)');
            isValid = false;
        }
        
        // Validate email (required and format)
        if (!email.value.trim()) {
            showError(email, 'Please enter your email address');
            isValid = false;
        } else if (!isValidEmail(email.value.trim())) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate subject (required)
        if (!subject.value.trim()) {
            showError(subject, 'Please enter a subject');
            isValid = false;
        } else if (subject.value.trim().length > 200) {
            showError(subject, 'Subject is too long (maximum 200 characters)');
            isValid = false;
        }
        
        // Validate message (required and length constraints)
        if (!message.value.trim()) {
            showError(message, 'Please enter your message');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            showError(message, 'Your message should be at least 10 characters');
            isValid = false;
        } else if (message.value.trim().length > 5000) {
            showError(message, 'Your message is too long (maximum 5000 characters)');
            isValid = false;
        }
        
        return isValid;
    }
    
    /**
     * Check if the submission might be spam
     * @return {boolean} True if spam is detected, false otherwise
     */
    function isSpam() {
        // Check honeypot field - if filled, it's likely a bot
        const honeypot = document.getElementById('website');
        if (honeypot && honeypot.value) {
            return true;
        }
        
        // Check submission time - if submitted too quickly (<2 seconds), it might be automated
        const formTime = parseInt(document.getElementById('formTime').value);
        const currentTime = Date.now();
        const elapsedTime = (currentTime - formTime) / 1000; // in seconds
        
        if (elapsedTime < 2) {
            return true;
        }
        
        return false;
    }
    
    /**
     * Submit the form via AJAX
     */
    function submitForm() {
        // Show loading state
        const submitButton = contactForm.querySelector('.btn-submit');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin ms-2"></i>';
        submitButton.disabled = true;
        
        // Hide previous alerts
        document.getElementById('formSuccess').classList.add('d-none');
        document.getElementById('formError').classList.add('d-none');
        
        // Get form data
        const formData = new FormData(contactForm);
        
        // Send AJAX request
        fetch(contactForm.getAttribute('action'), {
            method: 'POST',
            body: formData,
            credentials: 'same-origin' // Important for CSRF cookie handling
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            // Reset button state
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            // Handle response
            if (data.success) {
                // Show success message
                document.getElementById('formSuccess').classList.remove('d-none');
                document.getElementById('formError').classList.add('d-none');
                
                // Reset the form
                contactForm.reset();
                
                // Reset form timestamp
                document.getElementById('formTime').value = Date.now();
                
                // Update CSRF token if provided in the response
                if (data.csrf_token) {
                    document.getElementById('csrf_token').value = data.csrf_token;
                }
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    document.getElementById('formSuccess').classList.add('d-none');
                }, 5000);
            } else {
                // Show error message
                document.getElementById('formError').classList.remove('d-none');
                document.getElementById('formSuccess').classList.add('d-none');
                document.getElementById('formError').textContent = data.message || 'There was an error sending your message. Please try again.';
            }
        })
        .catch(error => {
            // Reset button state
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            // Show error message
            document.getElementById('formError').classList.remove('d-none');
            document.getElementById('formSuccess').classList.add('d-none');
            document.getElementById('formError').textContent = 'A network error occurred. Please try again.';
            
            console.error('Form submission error:', error);
        });
    }
    
    /**
     * Helper function to show validation error for a field
     * @param {HTMLElement} field - The form field with error
     * @param {string} message - The error message
     */
    function showError(field, message) {
        field.classList.add('is-invalid');
        
        // Find or create the feedback element
        let feedback = field.nextElementSibling;
        if (!feedback || !feedback.classList.contains('invalid-feedback')) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            field.parentNode.insertBefore(feedback, field.nextSibling);
        }
        
        feedback.textContent = message;
    }
    
    /**
     * Reset validation state for fields
     * @param {Array} fields - Array of form fields
     */
    function resetValidation(fields) {
        fields.forEach(field => {
            field.classList.remove('is-invalid');
        });
    }
    
    /**
     * Validate email format
     * @param {string} email - Email address to validate
     * @return {boolean} True if email format is valid, false otherwise
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Update character count for the message field
     */
    const messageField = document.getElementById('message');
    const countDisplay = document.getElementById('message-count');
    
    if (messageField && countDisplay) {
        messageField.addEventListener('input', function() {
            const remaining = 5000 - this.value.length;
            countDisplay.textContent = remaining + ' characters remaining';
            
            if (remaining < 0) {
                countDisplay.classList.add('text-danger');
            } else {
                countDisplay.classList.remove('text-danger');
            }
        });
        
        // Initial count
        messageField.dispatchEvent(new Event('input'));
    }
});
