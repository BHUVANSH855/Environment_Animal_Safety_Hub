/**
 * Report Form Handler
 *
 * Handles form submission for environmental and animal safety reports.
 * Provides user feedback and form reset functionality with smooth animations.
 *
 * Features:
 * - AOS (Animate On Scroll) library initialization
 * - Form submission handling with validation
 * - Success message display with emoji feedback
 * - Automatic form reset after submission
 * - Responsive design support
 *
 * @author Environment & Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

// ========== AOS INITIALIZATION ==========

/**
 * Initialize Animate On Scroll (AOS) library
 * Configures smooth scroll animations for the report page
 */
AOS.init({
    duration: 1000,    // Animation duration in milliseconds
    once: true,        // Animation occurs only once per element
});

// ========== FORM HANDLING ==========

/**
 * Report form element
 * @type {HTMLFormElement}
 */
const reportForm = document.getElementById("reportForm");

/**
 * Handle form submission
 * Prevents default submission, shows success message, and resets form
 * @param {Event} e - Form submit event
 */
reportForm.addEventListener("submit", function (e) {
    // Prevent default form submission
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const urgency = formData.get('urgency');
    const details = formData.get('details')?.trim() || '';

    // Basic validation
    if (!urgency) {
        alert("⚠️ Please select an urgency level for the report.");
        return;
    }

    // For emergency cases, require more details
    if (urgency === "emergency" && details.length < 10) {
        alert("🚨 For emergency reports, please provide more details about the danger situation (at least 10 characters).");
        return;
    }

    // Show appropriate success message based on urgency
    let message = "🦊 Thank you! Your report has been submitted successfully 💚";
    if (urgency === "emergency") {
        message = "🚨 EMERGENCY REPORT SUBMITTED! Help is on the way for this stray dog in danger 🐕‍🦺";
    } else if (urgency === "urgent") {
        message = "⚡ URGENT REPORT SUBMITTED! We'll prioritize assistance for this stray dog 🐕";
    }

    alert(message);

    // Reset form to clear all fields
    this.reset();
});