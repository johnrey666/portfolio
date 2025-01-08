/*global $, jQuery, alert*/
$(document).ready(function() {

  'use strict';

 

  // ========================================================================= //
  //  Typed Js
  // ========================================================================= //



  // ========================================================================= //
  //  Owl Carousel Services
  // ========================================================================= //


  $('.services-carousel').owlCarousel({
      

      margin: 20,
      dots: false,
      nav: false,

      responsive: { 0: { items: 1 }, 768: { items: 2 }, 900: { items: 3 } }
    });

  // ========================================================================= //
  //  magnificPopup
  // ========================================================================= //

  var magnifPopup = function() {
    $('.popup-img').magnificPopup({
      type: 'image',
      removalDelay: 300,
      mainClass: 'mfp-with-zoom',
      gallery: {
        enabled: true
      },
      zoom: {
        enabled: true, // By default it's false, so don't forget to enable it

        duration: 300, // duration of the effect, in milliseconds
        easing: 'ease-in-out', // CSS transition easing function

        // The "opener" function should return the element from which popup will be zoomed in
        // and to which popup will be scaled down
        // By defailt it looks for an image tag:
        opener: function(openerElement) {
          // openerElement is the element on which popup was initialized, in this case its <a> tag
          // you don't need to add "opener" option if this code matches your needs, it's defailt one.
          return openerElement.is('img') ? openerElement : openerElement.find('img');
        }
      }
    });
  };


  // Call the functions
  magnifPopup();

});

// ========================================================================= //
//  Portfolio isotope and filter
// ========================================================================= //
// ========================================================================= //
//  Portfolio isotope and filter
// ========================================================================= //
$(window).on('load', function() {
  // Initialize isotope
  var portfolioIsotope = $('.portfolio-container').isotope({
    itemSelector: '.portfolio-thumbnail',
    layoutMode: 'fitRows'
  });

  // Set the default filter to '.seniorcare' immediately
  portfolioIsotope.isotope({ filter: '.seniorcare' });

  // Set 'seniorcare' as the active filter in the navigation
  $("#portfolio-flters li").removeClass('filter-active');
  $("#portfolio-flters li[data-filter='.seniorcare']").addClass('filter-active');

  // Handle filter button clicks
  $('#portfolio-flters li').on('click', function() {
    $("#portfolio-flters li").removeClass('filter-active');
    $(this).addClass('filter-active');

    var selectedFilter = $(this).data('filter');
    portfolioIsotope.isotope({ filter: selectedFilter });

    // Update the lightbox items dynamically
    updateLightbox(selectedFilter);
  });

  // Function to update lightbox items
  function updateLightbox(filter) {
    var filteredItems = $('.portfolio-container').find(filter);

    // Destroy the current lightbox instance if needed
    if ($.fn.magnificPopup) {
      $.magnificPopup.close(); // Close any open popup
    }

    // Reinitialize the lightbox with the filtered items
    filteredItems.find('a.popup-img').magnificPopup({
      type: 'image',
      gallery: {
        enabled: true
      }
    });
  }

  // Initialize lightbox for the default filter
  updateLightbox('.seniorcare');
});


// Get elements
const resumeButton = document.getElementById("resumeButton");
const resumeModal = document.getElementById("resumeModal");
const closeModal = document.querySelector(".close");
const body = document.body; // Reference to the body for adding classes

// Open modal with background blur
resumeButton.addEventListener("click", () => {
  resumeModal.classList.add("show"); // Show the modal
  body.classList.add("body-blur"); // Add blur effect to background
});

// Close modal and remove blur
closeModal.addEventListener("click", () => {
  resumeModal.classList.remove("show"); // Hide the modal
  body.classList.remove("body-blur"); // Remove blur effect
});

// Close modal when clicking outside the image
window.addEventListener("click", (event) => {
  if (event.target === resumeModal) {
    resumeModal.classList.remove("show");
    body.classList.remove("body-blur");
  }
});


function showGithub(project) {
  let githubLink = '';

  if (project === 'seniorcare') {
    githubLink = 'https://github.com/yourusername/seniorcare-connect';  // Replace with actual link
  } else if (project === 'mailah') {
    githubLink = 'https://github.com/yourusername/mailah-lite';  // Replace with actual link
  } else if (project === 'dental') {
    githubLink = 'https://github.com/yourusername/creative-dental';  // Replace with actual link
  }

  // Inject the GitHub link into the page
  document.getElementById('github-link').innerHTML = `
    <h3>Check out the GitHub Repository for ${capitalizeFirstLetter(project)}:</h3>
    <a href="${githubLink}" target="_blank" class="btn btn-primary">View GitHub</a>
  `;
}

// Capitalize the first letter of the project name for proper display
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Initialize with the first filter (seniorcare) active
showGithub('seniorcare');