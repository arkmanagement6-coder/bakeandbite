import Store from './store.js';
import { renderHeader, renderFooter } from './components/common.js';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('header-root').appendChild(renderHeader());
    document.getElementById('footer-root').appendChild(renderFooter());

    setupFormNavigation();
});

function setupFormNavigation() {
    const form = document.getElementById('custom-cake-form');
    const steps = document.querySelectorAll('.form-step');
    const nextBtns = document.querySelectorAll('.next-step');
    const prevBtns = document.querySelectorAll('.prev-step');
    const successMsg = document.getElementById('success-msg');

    let currentStepIndex = 0;

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Basic validation for step 1
            if (currentStepIndex === 0) {
                if (!document.getElementById('cust-name').value || !document.getElementById('cust-mobile').value) {
                    alert('Please fill in your contact details');
                    return;
                }
            }
            
            steps[currentStepIndex].classList.remove('active');
            currentStepIndex++;
            steps[currentStepIndex].classList.add('active');
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            steps[currentStepIndex].classList.remove('active');
            currentStepIndex--;
            steps[currentStepIndex].classList.add('active');
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const enquiry = {
            customer: {
                name: document.getElementById('cust-name').value,
                mobile: document.getElementById('cust-mobile').value
            },
            cakeType: document.getElementById('cake-type').value,
            flavor: document.getElementById('cake-flavor').value,
            weight: document.getElementById('cake-weight').value,
            date: document.getElementById('req-date').value,
            message: document.getElementById('cake-msg').value,
            instructions: document.getElementById('special-instr').value,
            budget: document.getElementById('budget').value,
            imageRef: 'Simulated Image Path'
        };

        Store.saveEnquiry(enquiry);
        
        form.style.display = 'none';
        successMsg.style.display = 'block';
    });
}
