// Wait until the DOM is fully loaded
window.addEventListener('DOMContentLoaded', () => {
    const loadingVideo = document.getElementById('loadingVideo');
    loadingVideo.style.display = 'none';  // Hide the loading video after the DOM is loaded
});

// Handle the 'pageshow' event to hide the loading video when coming back from cache (like on back button)
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {  // Check if the page was loaded from the cache
        const loadingVideo = document.getElementById('loadingVideo');
        loadingVideo.style.display = 'none';  // Hide the loading video if the page is loaded from cache
    }
});

// Show loading animation on form submission
function showLoadingOnSubmit() {
    const loadingVideo = document.getElementById('loadingVideo');
    loadingVideo.style.display = 'block';  // Show the loading video when the form is submitted
}

// Attach event listener to all forms on the page (assuming there are multiple)
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
        showLoadingOnSubmit();  // Show loading video when the form is submitted
    });
});
