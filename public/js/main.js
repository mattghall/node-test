document.addEventListener('DOMContentLoaded', function() {
    // Random ID
    var randomId = Math.floor(Math.random() * 900) + 100;
    document.getElementById('randomId').value = randomId;
    var randomAge = Math.floor(Math.random() * 90) + 10;
    document.getElementById('randomAge').value = randomAge;
});