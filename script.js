document.addEventListener('DOMContentLoaded', () => {
    // Define the card data for each slot
    const slotData = {
        key: [
            'C Major', 'G Major', 'D Major', 'A Major', 'E Major', 'B Major', 'F# Major',
            'C# Major', 'F Major', 'Bb Major', 'Eb Major', 'Ab Major', 'Db Major', 'Gb Major',
            'A Minor', 'E Minor', 'B Minor', 'F# Minor', 'C# Minor', 'G# Minor', 'D# Minor',
            'A# Minor', 'D Minor', 'G Minor', 'C Minor', 'F Minor', 'Bb Minor', 'Eb Minor'
        ],
        progression: [
            'I-IV-V', 'I-V-vi-IV', 'ii-V-I', 'I-vi-IV-V', 'I-IV-vi-V',
            'i-VI-III-VII', 'I-V-vi-iii-IV', 'vi-IV-I-V', 'I-bVII-bVI-bVII',
            'i-iv-VII', 'I-iii-IV-V', 'i-iv-v', 'I-V-bVII-IV', 'i-bVI-bVII',
            'I-ii-iii-IV', 'i-bIII-bVII', 'I-IV-I-V', 'i-bVII-bVI-V',
            'I-vi-ii-V', 'I-bIII-bVII-IV'
        ],
        vibe: [
            'Melancholic', 'Euphoric', 'Dreamy', 'Aggressive', 'Nostalgic',
            'Triumphant', 'Mysterious', 'Playful', 'Ethereal', 'Haunting',
            'Intense', 'Serene', 'Chaotic', 'Uplifting', 'Somber',
            'Energetic', 'Reflective', 'Dramatic', 'Whimsical', 'Tense',
            'Hopeful', 'Gritty', 'Cosmic', 'Intimate', 'Anthemic',
            'Hypnotic', 'Quirky', 'Majestic', 'Brooding', 'Bittersweet'
        ],
        tempo: [
            '60 BPM - Largo', '76 BPM - Adagio', '88 BPM - Andante', '108 BPM - Moderato',
            '120 BPM - Allegro', '156 BPM - Vivace', '176 BPM - Presto', '200 BPM - Prestissimo',
            '90 BPM - Hip Hop', '128 BPM - House', '140 BPM - Techno', '174 BPM - Drum & Bass',
            'Rubato - Free Time', 'Swing - Shuffle', '3/4 Waltz', '6/8 Compound',
            'Polyrhythmic', 'Half-time Feel', 'Double-time Feel', 'Syncopated'
        ]
    };

    // Animation speed in milliseconds (lower = faster)
    const ANIMATION_SPEED = 150; // Reduced from 250ms to 150ms
    const LEVER_DELAY = 75; // Reduced from 150ms to 75ms
    const MULTI_ROTATION_DELAY = 30; // Reduced from 50ms to 30ms
    const SLOT_DELAY = 50; // Reduced from 100ms to 50ms

    // Current index for each slot
    const currentIndices = {
        key: 0,
        progression: 0,
        vibe: 0,
        tempo: 0
    };

    // Get DOM elements
    const slots = {
        key: document.getElementById('key-slot'),
        progression: document.getElementById('progression-slot'),
        vibe: document.getElementById('vibe-slot'),
        tempo: document.getElementById('tempo-slot')
    };

    const lever = document.getElementById('random-lever');

    // Initialize all slots with animating=false
    Object.keys(slots).forEach(slotType => {
        slots[slotType].dataset.animating = 'false';
    });

    // Make sure all cards are visible initially
    Object.keys(slots).forEach(slotType => {
        const card = slots[slotType].querySelector('.current-card');
        if (card) {
            card.style.transform = 'translateY(0)';
            card.style.opacity = '1';
        }
    });

    // Initialize the slots with the first cards
    updateCardValues();

    // Add click event listeners for each slot
    Object.keys(slots).forEach(slotType => {
        // Create click areas for top and bottom half
        const topClickArea = document.createElement('div');
        topClickArea.className = 'click-area top-click-area';
        topClickArea.style.position = 'absolute';
        topClickArea.style.top = '0';
        topClickArea.style.left = '0';
        topClickArea.style.width = '100%';
        topClickArea.style.height = '50%';
        topClickArea.style.zIndex = '20';
        topClickArea.style.cursor = 'pointer';
        
        const bottomClickArea = document.createElement('div');
        bottomClickArea.className = 'click-area bottom-click-area';
        bottomClickArea.style.position = 'absolute';
        bottomClickArea.style.bottom = '0';
        bottomClickArea.style.left = '0';
        bottomClickArea.style.width = '100%';
        bottomClickArea.style.height = '50%';
        bottomClickArea.style.zIndex = '20';
        bottomClickArea.style.cursor = 'pointer';
        
        // Add the click areas to the slot
        slots[slotType].style.position = 'relative';
        slots[slotType].appendChild(topClickArea);
        slots[slotType].appendChild(bottomClickArea);
        
        // Add event listeners to the top click area
        ['click', 'touchend'].forEach(eventType => {
            topClickArea.addEventListener(eventType, (event) => {
                if (event.type === 'touchend') {
                    event.preventDefault();
                }
                rotateSlot(slotType, 1);
            });
        });
        
        // Add event listeners to the bottom click area
        ['click', 'touchend'].forEach(eventType => {
            bottomClickArea.addEventListener(eventType, (event) => {
                if (event.type === 'touchend') {
                    event.preventDefault();
                }
                rotateSlot(slotType, -1);
            });
        });
    });

    // Add click and touch events for the lever
    ['click', 'touchend'].forEach(eventType => {
        lever.addEventListener(eventType, (event) => {
            if (event.type === 'touchend') {
                event.preventDefault();
            }
            pullLever();
        });
    });

    // Function to rotate a specific slot
    function rotateSlot(slotType, direction) {
        // Prevent multiple clicks during animation
        if (slots[slotType].dataset.animating === 'true') {
            return;
        }
        
        slots[slotType].dataset.animating = 'true';
        
        // Get the current card
        const currentCard = slots[slotType].querySelector('.current-card');
        
        // Create a new card that will slide in
        const newCard = document.createElement('div');
        newCard.className = `card ${getColorClass(slotType)}`;
        
        // Update the index
        currentIndices[slotType] = (currentIndices[slotType] + direction + slotData[slotType].length) % slotData[slotType].length;
        
        // Set the content of the new card
        newCard.innerHTML = `
            <div class="card-content">
                <p class="card-value">${slotData[slotType][currentIndices[slotType]]}</p>
            </div>
        `;
        
        // Position the new card
        if (direction > 0) {
            // Coming from below
            newCard.style.transform = 'translateY(100%)';
        } else {
            // Coming from above
            newCard.style.transform = 'translateY(-100%)';
        }
        
        // Add the new card to the slot after the slot title
        const slotTitle = slots[slotType].querySelector('.slot-title');
        if (slotTitle.nextSibling) {
            slots[slotType].insertBefore(newCard, slotTitle.nextSibling);
        } else {
            slots[slotType].appendChild(newCard);
        }
        
        // Force reflow
        newCard.offsetHeight;
        
        // Animate the current card out
        currentCard.style.transform = direction > 0 ? 'translateY(-100%)' : 'translateY(100%)';
        
        // Animate the new card in
        newCard.style.transform = 'translateY(0)';
        newCard.classList.add('current-card');
        
        // Remove the old card after animation
        setTimeout(() => {
            if (currentCard.parentNode) {
                currentCard.remove();
            }
            slots[slotType].dataset.animating = 'false';
        }, ANIMATION_SPEED);
    }

    // Function to pull the lever and randomize all slots
    function pullLever() {
        // Prevent lever pull during animation
        if (Object.values(slots).some(slot => slot.dataset.animating === 'true')) {
            return;
        }
        
        // Animate the lever
        const leverHandle = lever.querySelector('.lever-handle');
        leverHandle.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            leverHandle.style.transform = '';
            
            // Randomize each slot with a slight delay between them
            Object.keys(slots).forEach((slotType, index) => {
                setTimeout(() => {
                    // Get random index
                    const randomIndex = Math.floor(Math.random() * slotData[slotType].length);
                    const direction = randomIndex > currentIndices[slotType] ? 1 : -1;
                    
                    // Calculate the number of steps to take
                    const steps = Math.abs(randomIndex - currentIndices[slotType]);
                    
                    // If we're already at the target index, still rotate once
                    if (steps === 0) {
                        rotateSlot(slotType, 1);
                    } else {
                        // Simulate multiple rotations with a delay
                        simulateMultipleRotations(slotType, direction, Math.min(steps, 3)); // Limit to 3 rotations max for faster settling
                    }
                    
                    currentIndices[slotType] = randomIndex;
                }, index * SLOT_DELAY);
            });
        }, LEVER_DELAY);
    }

    // Function to simulate multiple rotations with a delay
    function simulateMultipleRotations(slotType, direction, steps) {
        // Prevent multiple clicks during animation
        if (slots[slotType].dataset.animating === 'true') {
            return;
        }
        
        slots[slotType].dataset.animating = 'true';
        
        // Get the current card
        const currentCard = slots[slotType].querySelector('.current-card');
        
        // Create a new card that will slide in
        const newCard = document.createElement('div');
        newCard.className = `card ${getColorClass(slotType)}`;
        
        // Update the index for this rotation
        currentIndices[slotType] = (currentIndices[slotType] + direction + slotData[slotType].length) % slotData[slotType].length;
        
        // Set the content of the new card
        newCard.innerHTML = `
            <div class="card-content">
                <p class="card-value">${slotData[slotType][currentIndices[slotType]]}</p>
            </div>
        `;
        
        // Position the new card
        if (direction > 0) {
            // Coming from below
            newCard.style.transform = 'translateY(100%)';
        } else {
            // Coming from above
            newCard.style.transform = 'translateY(-100%)';
        }
        
        // Add the new card to the slot after the slot title
        const slotTitle = slots[slotType].querySelector('.slot-title');
        if (slotTitle.nextSibling) {
            slots[slotType].insertBefore(newCard, slotTitle.nextSibling);
        } else {
            slots[slotType].appendChild(newCard);
        }
        
        // Force reflow
        newCard.offsetHeight;
        
        // Animate the current card out
        currentCard.style.transform = direction > 0 ? 'translateY(-100%)' : 'translateY(100%)';
        
        // Animate the new card in
        newCard.style.transform = 'translateY(0)';
        newCard.classList.add('current-card');
        
        // Remove the old card after animation
        setTimeout(() => {
            if (currentCard.parentNode) {
                currentCard.remove();
            }
            
            // If we have more steps, continue rotating
            if (steps > 1) {
                setTimeout(() => {
                    simulateMultipleRotations(slotType, direction, steps - 1);
                }, MULTI_ROTATION_DELAY);
            } else {
                slots[slotType].dataset.animating = 'false';
            }
        }, ANIMATION_SPEED);
    }

    // Helper function to update all card values
    function updateCardValues() {
        Object.keys(slots).forEach(slotType => {
            const card = slots[slotType].querySelector('.current-card');
            const valueElement = card.querySelector('.card-value');
            valueElement.textContent = slotData[slotType][currentIndices[slotType]];
        });
    }

    // Helper function to get the color class for a slot type
    function getColorClass(slotType) {
        switch(slotType) {
            case 'key': return 'burgundy';
            case 'progression': return 'yellow';
            case 'vibe': return 'green';
            case 'tempo': return 'blue';
            default: return '';
        }
    }
}); 