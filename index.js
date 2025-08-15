// Object Animations and Section transitions

const cardObserver = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
        const parentSection = entry.target.closest('.content-section')
        if(entry.isIntersecting){
            entry.target.classList.add("show")
            if (currentSection !== parentSection) {
                currentSection = parentSection;
                console.log("Current section changed:", currentSection.id);
                setBackgroundSet(currentSection.id)
            }
        }else{
            entry.target.classList.remove("show")
        }
    })
}, {threshold: 0.3})

const cardElements = document.querySelectorAll('[class*="card"]')
let currentSection = null;

// Media type changes

const desktopMediaQuery = window.matchMedia("(min-width: 50em)");
const tabletMediaQuery = window.matchMedia("(min-width: 32em)");
const phoneMediaQuery = window.matchMedia("(max-width: 31.99em)");

let currentMediaType = "";

function detectMediaType() {
  if (desktopMediaQuery.matches) {
    document.querySelectorAll('[class*="vertical-card"]').forEach(element => {
        cardObserver.unobserve(element)
        element.className = "horizontal-card";
        element.querySelectorAll('[class*="blurb"]').forEach(nestedBlurb => {
            nestedBlurb.className = "horizontal-content-blurb"
        })
        element.querySelectorAll('[class*="image"]').forEach(nestedImage => {
            nestedImage.className = "horizontal-content-image"
        })
        cardObserver.observe(element)
    });
    return "desktop";
  } else if (tabletMediaQuery.matches) {
    document.querySelectorAll('[class*="horizontal-card"]').forEach(element => {
        if (element.id !== "c2") {return}
        cardObserver.unobserve(element)
        element.className = "vertical-card";
        element.querySelectorAll('[class*="blurb"]').forEach(nestedBlurb => {
            nestedBlurb.className = "vertical-content-blurb"
        })
        element.querySelectorAll('[class*="image"]').forEach(nestedImage => {
            nestedImage.className = "vertical-content-image"
        })
        cardObserver.observe(element)
    });
    return "tablet";
  } else if (phoneMediaQuery.matches) {
    document.querySelectorAll('[class*="horizontal-card"]').forEach(element => {
        cardObserver.unobserve(element)
        element.className = "vertical-card";
        element.querySelectorAll('[class*="blurb"]').forEach(nestedBlurb => {
            nestedBlurb.className = "vertical-content-blurb"
        })
        element.querySelectorAll('[class*="image"]').forEach(nestedImage => {
            nestedImage.className = "vertical-content-image"
        })
        cardObserver.observe(element)
    });
    return "phone";
  }
  return "unknown";
}

function handleMediaChange() {
  const newMediaType = detectMediaType();
  if (newMediaType !== currentMediaType) {
    console.log(`Switched to ${newMediaType} view`);
    currentMediaType = newMediaType;
  }
}

// Startup

handleMediaChange();
desktopMediaQuery.addEventListener("change", handleMediaChange);
tabletMediaQuery.addEventListener("change", handleMediaChange);
phoneMediaQuery.addEventListener("change", handleMediaChange);
cardElements.forEach(element => cardObserver.observe(element))
document.addEventListener('scroll', handleInteraction);
document.addEventListener('touchstart', handleInteraction);
document.addEventListener('click', handleInteraction);

// Background

function setBackgroundSet(index) {
  const totalBackgrounds = 5
  for (let i = 0; i < totalBackgrounds; i++) {
    const bg = document.getElementById(`bg${i}`);
    const bm = document.getElementById(`bm${i}`);
    if (bg) {
      bg.style.opacity = (i === parseInt(index, 10)) ? '0.5' : '0';
    }
    if (bm) {
        if (i === parseInt(index, 10)) {
            bm.play();
            fadeVolume(bm, 0.5, 1000);
            console.log(`Ambience audio for section ${i} playing`);
        } else {
            fadeVolume(bm, 0, 1000);
        }
    }
  }
}

function fadeVolume(audio, targetVolume, duration = 1000) {
  if (!audio) return;

  const stepTime = 50;
  const steps = duration / stepTime;
  const volumeStep = (targetVolume - audio.volume) / steps;

  let currentStep = 0;
  const fade = setInterval(() => {
    currentStep++;
    audio.volume = Math.max(0, Math.min(1, audio.volume + volumeStep));

    if (currentStep >= steps) {
      audio.volume = targetVolume;
      clearInterval(fade);
    }
  }, stepTime);
}