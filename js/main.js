/*global $, jQuery, alert*/
$(document).ready(function() {
  'use strict';
  // ========================================================================= //
  //  Typed Js
  // ========================================================================= //
  // Note: No Typed.js implementation in original code, kept as comment
  // ========================================================================= //
  //  Owl Carousel Services
  // ========================================================================= //
  $('.services-carousel').owlCarousel({
    margin: 15,
    dots: true,
    nav: true,
    navText: ['<i class="ion-ios-arrow-left"></i>', '<i class="ion-ios-arrow-right"></i>'],
    responsive: {
      0: { items: 1, margin: 10 },
      576: { items: 2, margin: 10 },
      768: { items: 2 },
      992: { items: 3 }
    }
  });
  // ========================================================================= //
  //  Owl Carousel All Projects (Mobile View)
  // ========================================================================= //
  if ($(window).width() <= 767) {
    $('.all-projects-carousel').owlCarousel({
      margin: 10,
      dots: true,
      nav: true,
      navText: ['<i class="ion-ios-arrow-left"></i>', '<i class="ion-ios-arrow-right"></i>'],
      autoplay: true,
      autoplayTimeout: 3000,
      items: 1
    });
  }
  // ========================================================================= //
  //  magnificPopup
  // ========================================================================= //
  var magnifPopup = function(selector) {
    $(selector).find('.popup-img').magnificPopup({
      type: 'image',
      removalDelay: 300,
      mainClass: 'mfp-with-zoom mfp-img-mobile',
      gallery: {
        enabled: true,
        navigateByImgClick: true
      },
      zoom: {
        enabled: true,
        duration: 300,
        easing: 'ease-in-out',
        opener: function(openerElement) {
          return openerElement.is('img') ? openerElement : openerElement.find('img');
        }
      },
      image: {
        verticalFit: true // Ensure images fit within viewport on mobile
      }
    });
  };
  // Call Magnific Popup for grid, portfolio carousel, and all projects carousel
  magnifPopup('.portfolio-container');
  magnifPopup('.portfolio-carousel');
  magnifPopup('.all-projects-carousel');
});
// ========================================================================= //
//  Portfolio isotope and filter
// ========================================================================= //
$(window).on('load', function() {
  // Initialize isotope for grid (desktop)
  var portfolioIsotope = $('.portfolio-container').isotope({
    itemSelector: '.portfolio-thumbnail',
    layoutMode: 'fitRows'
  });
  // Initialize portfolio carousel for mobile
  if ($(window).width() <= 767) {
    $('.portfolio-carousel').owlCarousel({
      margin: 10,
      dots: true,
      nav: true,
      navText: ['<i class="ion-ios-arrow-left"></i>', '<i class="ion-ios-arrow-right"></i>'],
      items: 1
    });
    $('.all-projects-carousel').owlCarousel({
      margin: 10,
      dots: true,
      nav: true,
      navText: ['<i class="ion-ios-arrow-left"></i>', '<i class="ion-ios-arrow-right"></i>'],
      autoplay: true,
      autoplayTimeout: 3000,
      items: 1
    });
  }
  // Handle window resize to initialize/destroy carousels
  $(window).on('resize', function() {
    if ($(window).width() <= 767) {
      if (!$('.portfolio-carousel').hasClass('owl-loaded')) {
        $('.portfolio-carousel').owlCarousel({
          margin: 10,
          dots: true,
          nav: true,
          navText: ['<i class="ion-ios-arrow-left"></i>', '<i class="ion-ios-arrow-right"></i>'],
          items: 1
        });
        magnifPopup('.portfolio-carousel');
      }
      if (!$('.all-projects-carousel').hasClass('owl-loaded')) {
        $('.all-projects-carousel').owlCarousel({
          margin: 10,
          dots: true,
          nav: true,
          navText: ['<i class="ion-ios-arrow-left"></i>', '<i class="ion-ios-arrow-right"></i>'],
          autoplay: true,
          autoplayTimeout: 3000,
          items: 1
        });
        magnifPopup('.all-projects-carousel');
      }
    } else {
      $('.portfolio-carousel').owlCarousel('destroy');
      $('.all-projects-carousel').owlCarousel('destroy');
      magnifPopup('.portfolio-carousel');
      magnifPopup('.all-projects-carousel');
    }
  });
  // Set the default filter to '.watermonitoring' immediately
  portfolioIsotope.isotope({ filter: '.watermonitoring' });
  $('.portfolio-carousel').find('.portfolio-item').hide();
  $('.portfolio-carousel').find('.watermonitoring').show();
  // Set 'watermonitoring' as the active filter in the navigation
  $("#portfolio-flters li").removeClass('filter-active');
  $("#portfolio-flters li[data-filter='.watermonitoring']").addClass('filter-active');
  // Handle filter button clicks
  $('#portfolio-flters li').on('click', function() {
    $("#portfolio-flters li").removeClass('filter-active');
    $(this).addClass('filter-active');
    var selectedFilter = $(this).data('filter');
    portfolioIsotope.isotope({ filter: selectedFilter });
    // Update carousel visibility
    $('.portfolio-carousel').find('.portfolio-item').hide();
    $('.portfolio-carousel').find(selectedFilter).show();
    $('.portfolio-carousel').trigger('refresh.owl.carousel');
    // Update lightbox for filtered items
    updateLightbox(selectedFilter);
  });
  // Function to update lightbox items
  function updateLightbox(filter) {
    var filteredItems = $('.portfolio-container').find(filter);
    var carouselItems = $('.portfolio-carousel').find(filter);
    // Destroy current lightbox instances
    if ($.fn.magnificPopup) {
      $.magnificPopup.close();
    }
    // Reinitialize lightbox for grid and carousel
    filteredItems.find('.popup-img').magnificPopup({
      type: 'image',
      gallery: { enabled: true },
      image: { verticalFit: true }
    });
    carouselItems.find('.popup-img').magnificPopup({
      type: 'image',
      gallery: { enabled: true },
      image: { verticalFit: true }
    });
  }
  // Initialize lightbox for the default filter
  updateLightbox('.watermonitoring');
});
// ========================================================================= //
//  Resume Modal
// ========================================================================= //
const resumeButton = document.getElementById("resumeButton");
const resumeModal = document.getElementById("resumeModal");
const closeModal = document.querySelector(".close");
const body = document.body;
// Open modal with background blur
resumeButton.addEventListener("click", () => {
  resumeModal.classList.add("show");
  body.classList.add("body-blur");
});
// Close modal and remove blur
closeModal.addEventListener("click", () => {
  resumeModal.classList.remove("show");
  body.classList.remove("body-blur");
});
// Close modal when clicking outside the image
window.addEventListener("click", (event) => {
  if (event.target === resumeModal) {
    resumeModal.classList.remove("show");
    body.classList.remove("body-blur");
  }
});
// Add touch support for mobile
resumeModal.addEventListener("touchstart", (event) => {
  if (event.target === resumeModal) {
    resumeModal.classList.remove("show");
    body.classList.remove("body-blur");
  }
});
// ========================================================================= //
//  GitHub Links
// ========================================================================= //
function showGithub(project) {
  let githubLink = '';
  if (project === 'watermonitoring') {
    githubLink = 'https://github.com/johnrey666/water_pipe_monitoring.git';
  } else if (project === 'seniorcare') {
    githubLink = 'https://github.com/johnrey666/seniorcare.git';
  } else if (project === 'mailah') {
    githubLink = 'https://github.com/johnrey666/dado_firebase.git';
  } else if (project === 'dental') {
    githubLink = 'https://github.com/johnrey666/creative_dental.git';
  }
  // Check if github-link element exists before updating
  const githubLinkDiv = document.getElementById('github-link');
  if (githubLinkDiv) {
    githubLinkDiv.innerHTML = `<h3>Check out the GitHub Repository for ${capitalizeFirstLetter(project)}:</h3>
      <a href="${githubLink}" target="_blank" class="btn btn-primary">View GitHub</a>`;
  }
}
// Capitalize the first letter of the project name for proper display
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
// Initialize with the first filter (watermonitoring) active
showGithub('watermonitoring');