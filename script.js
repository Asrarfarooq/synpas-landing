document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Theme Logic (Dark/Light)
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        icon.classList.replace('ph-moon', 'ph-sun');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            icon.classList.replace('ph-moon', 'ph-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.replace('ph-sun', 'ph-moon');
            localStorage.setItem('theme', 'light');
        }
    });

    // 2. Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => observer.observe(el));

    // 3. Smooth Scroll for "Early Access"
    window.scrollToWaitlist = function() {
        document.getElementById('waitlist-section').scrollIntoView({ 
            behavior: 'smooth' 
        });
    };

    // 4. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) otherItem.classList.remove('active');
            });
            // Toggle current
            item.classList.toggle('active');
        });
    });

    // 5. Airtable Integration (With Simulation Fallback)
    const form = document.getElementById('airtable-form');
    const emailInput = document.getElementById('email');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const messageDisplay = document.getElementById('form-message');

    
    // CONFIGURATION: 
    // YOUR API KEY (Keep this)
    const AIRTABLE_API_KEY = 'patuIVc3qNLApTz7a.a11c3e7bea8c9204ea47439ae290dc31d62c29b5538f93dec1d5e56ce04d8491'; 
    
    // CORRECT BASE ID (I extracted this from your link)
    const AIRTABLE_BASE_ID = 'appwzSkOW0A5FRqsT';
    
    // TABLE NAME (Must match the tab name in Airtable exactly)
    const AIRTABLE_TABLE_NAME = 'Waitlist';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value;

        // UI Loading State
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        submitBtn.disabled = true;

        try {
            // NOTE: Since you don't have the API key configured yet, 
            // I added a simulation so you can see the UI feedback immediately.
            // When you are ready, uncomment the fetch block below.
            
            const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fields: {
                        "Email": email,
                        "Status": "Pending"
                    }
                })
            });

            if (!response.ok) throw new Error('API Error');

            // SIMULATION (Delete this block when you add real API keys)
            //await new Promise(resolve => setTimeout(resolve, 1500)); // Fake 1.5s delay
            //console.log(`Captured email: ${email} (Simulation Mode)`);
            // END SIMULATION

            // Success State
            messageDisplay.textContent = "You're on the list! We'll be in touch.";
            messageDisplay.className = 'form-message success';
            emailInput.value = '';
            
        } catch (error) {
            console.error(error);
            messageDisplay.textContent = "Something went wrong. Please try again.";
            messageDisplay.className = 'form-message error';
        } finally {
            // Reset Button
            btnText.style.display = 'inline-block';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
            
            if(messageDisplay.classList.contains('success')) {
                submitBtn.innerText = "Joined";
                submitBtn.disabled = true;
            }
        }
    });
});