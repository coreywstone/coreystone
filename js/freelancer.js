/*!
 * Start Bootstrap - Freelancer Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// Remove slide-ins on mobile
if ( $(window).width() < 768) {
	$("div").removeClass("slide-right slide-left");
}

// Popup for school stuff
function popup(url, name, width, height, scrollbars) { 
  var popwin; 
  var opts =  "toolbar=no,status=no,location=no,menubar=no,resizable=yes"; 
  opts += ",width=" + width + ",height=" + height + ",scrollbars=" + scrollbars; 
  popwin = window.open(url, name, opts); 
  popwin.focus();
  return false; 
}

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('body').on('click', '.page-scroll a', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Floating label headings for the contact form
$(function() {
    $("body").on("input propertychange", ".floating-label-form-group", function(e) {
        $(this).toggleClass("floating-label-form-group-with-value", !! $(e.target).val());
    }).on("focus", ".floating-label-form-group", function() {
        $(this).addClass("floating-label-form-group-with-focus");
    }).on("blur", ".floating-label-form-group", function() {
        $(this).removeClass("floating-label-form-group-with-focus");
    });
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
    target: '.navbar-fixed-top'
})

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});

// Scroll up
$(function () {
    $.scrollUp({
        scrollName: 'scrollUp',      // Element ID
        scrollDistance: 300,         // Distance from top/bottom before showing element (px)
        scrollSpeed: 300,            // Speed back to top (ms)
        easingType: 'linear',        // Scroll to top easing (see http://easings.net/)
        animation: 'fade'          // Z-Index for the overlay
    });
});

// Start Project tabs
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-btn');
    const projects = document.querySelectorAll('.project-box');

    // Function to handle tab switching
    const switchTab = (filter) => {
        // Remove active class from all tabs
        tabs.forEach(t => {
            if (t.dataset.filter === filter) {
                t.classList.add('active');
            } else {
                t.classList.remove('active');
            }
        });
        
        projects.forEach(project => {
            if (filter === 'all') {
                project.classList.remove('hidden');
            } else {
                const categories = project.dataset.category.split(' ');
                if (categories.includes(filter)) {
                    project.classList.remove('hidden');
                } else {
                    project.classList.add('hidden');
                }
            }
        });

        // Scroll tab into view on mobile
        const activeTab = document.querySelector(`.tab-btn[data-filter="${filter}"]`);
        if (activeTab) {
            scrollTabIntoView(activeTab);
        }
    };

    const scrollTabIntoView = (tab) => {
        const container = document.querySelector('.tab-container');
        const tabRect = tab.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
            tab.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    };

    // Handle URL hash changes
    const handleHash = () => {
        const hash = window.location.hash.replace('#', '');
        if (hash && [...tabs].some(tab => tab.dataset.filter === hash)) {
            switchTab(hash);
        } else {
            switchTab('all');
        }
    };

    // Handle tab clicks
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default hash behavior
            const filter = tab.dataset.filter;
            window.location.hash = filter;
            switchTab(filter);
        });
    });

    // Initial state setup
    handleHash();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHash);
});
// End project tabs

