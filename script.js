document.addEventListener('DOMContentLoaded', function() {
    // Copy button functionality
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-code');
            
            // Create temporary textarea to copy text
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            
            // Select and copy the text
            textarea.select();
            document.execCommand('copy');
            
            // Remove the textarea
            document.body.removeChild(textarea);
            
            // Change button text to indicate successful copy
            const originalText = this.textContent;
            this.textContent = 'Copied!';
            this.style.backgroundColor = '#2ea44f';
            this.style.borderColor = '#2ea44f';
            
            // Reset button text after a delay
            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = '';
                this.style.borderColor = '';
            }, 2000);
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
                
                // Update URL hash without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Highlight current section in TOC based on scroll position
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.toc a');
    
    function highlightCurrentSection() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const scrollPosition = window.scrollY;
            
            if (scrollPosition >= sectionTop - 100 && 
                scrollPosition < sectionTop + sectionHeight - 100) {
                currentSection = '#' + section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSection) {
                link.classList.add('active');
            }
        });
    }
    
    // Add active class style
    const style = document.createElement('style');
    style.textContent = `
        .toc a.active {
            background-color: #f6f8fa;
            border-left: 3px solid #0366d6;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
    
    // Add scroll event listener
    window.addEventListener('scroll', highlightCurrentSection);
    
    // Initialize highlighting
    highlightCurrentSection();
});
