// =========================================================
// GMSA UDS TLC — MAIN JAVASCRIPT
// =========================================================

const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwcakG7FuBQsnEjKoyts73Iuz3RPHqN3UVSPQ0TcO9TiPm0YHpQL6GySFYZbzReicr8SQ/exec";


// =========================================================
// INITIALIZATION
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

    initTheme();
    initMobileNav();
    initLightbox();
    initSmoothNavigation();

    initPaymentForms();

    fetchData();

    const smsForm =
        document.getElementById('smsSignupForm');

    const fbForm =
        document.getElementById('feedbackForm');

    if (smsForm) {
        smsForm.addEventListener(
            'submit',
            handleSmsSignup
        );
    }

    if (fbForm) {
        fbForm.addEventListener(
            'submit',
            handleFeedbackSubmit
        );
    }

    // Check whether Paystack redirected
    // the user back with a transaction reference.
    handlePaystackCallback();

});


// =========================================================
// THEME TOGGLE
// =========================================================

function initTheme() {

    const themeBtn =
        document.getElementById('themeToggle');

    const currentTheme =
        localStorage.getItem('theme') || 'light';

    document.documentElement.setAttribute(
        'data-theme',
        currentTheme
    );

    updateThemeIcon(currentTheme);

    if (themeBtn) {

        themeBtn.addEventListener('click', () => {

            const theme =
                document.documentElement.getAttribute(
                    'data-theme'
                );

            const newTheme =
                theme === 'light'
                    ? 'dark'
                    : 'light';

            document.documentElement.setAttribute(
                'data-theme',
                newTheme
            );

            localStorage.setItem(
                'theme',
                newTheme
            );

            updateThemeIcon(newTheme);

        });

    }

}


function updateThemeIcon(theme) {

    const themeIcon =
        document.getElementById('themeIcon');

    if (!themeIcon) return;

    themeIcon.className =
        theme === 'dark'
            ? 'fas fa-sun'
            : 'fas fa-moon';

}


// =========================================================
// MOBILE NAVIGATION
// =========================================================

function initMobileNav() {

    const hamburger =
        document.getElementById('hamburger');

    const navLinks =
        document.getElementById('navLinks');

    if (!hamburger || !navLinks) return;


    hamburger.addEventListener('click', () => {

        navLinks.classList.toggle('active');

        const icon =
            hamburger.querySelector('i');

        if (navLinks.classList.contains('active')) {

            hamburger.setAttribute(
                'aria-label',
                'Close Menu'
            );

            if (icon) {
                icon.className =
                    'fas fa-xmark';
            }

        } else {

            hamburger.setAttribute(
                'aria-label',
                'Open Menu'
            );

            if (icon) {
                icon.className =
                    'fas fa-bars';
            }

        }

    });


    navLinks.querySelectorAll('a').forEach(link => {

        link.addEventListener('click', () => {

            navLinks.classList.remove('active');

            hamburger.setAttribute(
                'aria-label',
                'Open Menu'
            );

            const icon =
                hamburger.querySelector('i');

            if (icon) {
                icon.className =
                    'fas fa-bars';
            }

        });

    });


    document.addEventListener('click', (event) => {

        if (
            navLinks.classList.contains('active') &&
            !navLinks.contains(event.target) &&
            !hamburger.contains(event.target)
        ) {

            navLinks.classList.remove('active');

            const icon =
                hamburger.querySelector('i');

            if (icon) {
                icon.className =
                    'fas fa-bars';
            }

        }

    });

}


// =========================================================
// NAVIGATION
// =========================================================

function initSmoothNavigation() {

    const links =
        document.querySelectorAll('.nav-links a');

    links.forEach(link => {

        link.addEventListener('click', () => {

            links.forEach(item => {
                item.classList.remove('active');
            });

            link.classList.add('active');

        });

    });

}


// =========================================================
// IMAGE LIGHTBOX
// =========================================================

function initLightbox() {

    const modal =
        document.getElementById('imageModal');

    const modalImg =
        document.getElementById('expandedImg');

    const closeBtn =
        document.querySelector('.modal-close');

    if (!modal || !modalImg) return;


    document.body.addEventListener('click', (e) => {

        if (
            e.target.classList.contains(
                'expandable-img'
            )
        ) {

            modal.style.display =
                'block';

            modalImg.src =
                e.target.src;

        }

    });


    if (closeBtn) {

        closeBtn.onclick = () => {

            modal.style.display =
                'none';

        };

    }


    modal.onclick = (e) => {

        if (e.target === modal) {

            modal.style.display =
                'none';

        }

    };

}


// =========================================================
// FETCH DATA
// =========================================================

async function fetchData() {

    const cachedData =
        localStorage.getItem(
            'gmsa_cached_data'
        );


    if (cachedData) {

        try {

            renderAllData(
                JSON.parse(cachedData)
            );

        } catch (e) {

            console.error(
                "Cache render error:",
                e
            );

        }

    }


    try {

        const response =
            await fetch(
                `${SCRIPT_URL}?action=getData&_=${Date.now()}`,
                {
                    cache: 'no-store'
                }
            );

        const data =
            await response.json();


        if (data) {

            renderAllData(data);

            localStorage.setItem(
                'gmsa_cached_data',
                JSON.stringify(data)
            );

        }

    } catch (err) {

        console.log(
            "Loading fallback or cached data...",
            err
        );

    }

}


// =========================================================
// LIVE REFRESH
// =========================================================

setInterval(() => {

    fetchData();

}, 30000);


// =========================================================
// RENDER ALL DATA
// =========================================================

function renderAllData(data) {

    if (!data) return;

    if (data.prayers) {
        renderPrayerTimes(data.prayers);
    }

    if (data.stats) {
        renderStats(data.stats);
    }

    if (data.programs) {
        renderPrograms(data.programs);
    }

    if (data.news) {
        renderNews(data.news);
    }

    if (data.executives) {
        renderExecutives(data.executives);
    }

    if (data.reminder) {
        renderReminder(data.reminder);
    }

}


// =========================================================
// PRAYER TIMES
// =========================================================

function renderPrayerTimes(prayers) {

    if (!prayers) return;

    const times = {

        fajrTime:
            prayers.fajr ||
            '04:50 AM',

        dhuhrTime:
            prayers.dhuhr ||
            '12:20 PM',

        asrTime:
            prayers.asr ||
            '03:30 PM',

        maghribTime:
            prayers.maghrib ||
            '06:15 PM',

        ishaTime:
            prayers.isha ||
            '07:25 PM',

        jumuahTime:
            prayers.jumuah ||
            '01:00 PM'

    };


    Object.entries(times).forEach(
        ([id, value]) => {

            const element =
                document.getElementById(id);

            if (element) {
                element.innerText =
                    value;
            }

        }
    );

}


// =========================================================
// MUSLIM COUNTER
// =========================================================

let displayedMuslimCount = 0;
let muslimCounterAnimation = null;


function getNumber(value) {

    const cleaned =
        String(value ?? '')
            .replace(/[^\d.-]/g, '');

    const number =
        Number(cleaned);

    return Number.isFinite(number)
        ? Math.max(
            0,
            Math.round(number)
        )
        : 0;

}


function animateMuslimCount(target) {

    const countEl =
        document.getElementById(
            'muslimCount'
        );

    if (!countEl) return;


    target =
        getNumber(target);


    if (muslimCounterAnimation) {

        cancelAnimationFrame(
            muslimCounterAnimation
        );

    }


    const start =
        displayedMuslimCount;

    const difference =
        target - start;


    if (difference === 0) {

        countEl.innerText =
            target.toLocaleString();

        return;

    }


    const duration =
        1000;

    const startTime =
        performance.now();


    countEl.classList.add(
        'counter-changing'
    );


    function updateCounter(currentTime) {

        const progress =
            Math.min(
                (currentTime - startTime) /
                duration,
                1
            );


        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        const currentValue =
            Math.round(
                start +
                difference *
                eased
            );


        countEl.innerText =
            currentValue.toLocaleString();


        if (progress < 1) {

            muslimCounterAnimation =
                requestAnimationFrame(
                    updateCounter
                );

        } else {

            displayedMuslimCount =
                target;

            countEl.innerText =
                target.toLocaleString();

            setTimeout(() => {

                countEl.classList.remove(
                    'counter-changing'
                );

            }, 150);

        }

    }


    muslimCounterAnimation =
        requestAnimationFrame(
            updateCounter
        );

}


function renderStats(stats) {

    const countEl =
        document.getElementById(
            'muslimCount'
        );

    if (!countEl || !stats) return;


    const target =
        getNumber(
            stats.muslimCount
        );


    animateMuslimCount(target);

}


// =========================================================
// DAILY REMINDER
// =========================================================

function renderReminder(reminder) {

    if (!reminder) return;


    const textEl =
        document.getElementById(
            'dailyReminderText'
        );

    const containerEl =
        document.getElementById(
            'reminderImageContainer'
        );


    if (textEl && reminder.text) {

        textEl.innerText =
            reminder.text;

    }


    if (!containerEl) return;


    if (reminder.imageUrl) {

        containerEl.innerHTML = `
            <img
                src="${escapeAttribute(reminder.imageUrl)}"
                loading="lazy"
                class="expandable-img rounded-img"
                style="
                    margin-top:10px;
                    max-height:200px;
                    object-fit:cover;
                "
                onerror="this.style.display='none'"
            >
        `;

    } else {

        containerEl.innerHTML =
            "";

    }

}


// =========================================================
// PROGRAMS
// =========================================================

function renderPrograms(programs) {

    const container =
        document.getElementById(
            'programsContainer'
        );

    if (!container) return;


    if (
        !programs ||
        programs.length === 0
    ) {

        container.innerHTML =
            `<p>No upcoming events at the moment.</p>`;

        return;

    }


    container.innerHTML =
        programs.map(p => `

            <div class="card">

                ${
                    p.imageUrl
                    ? `
                        <img
                            src="${escapeAttribute(p.imageUrl)}"
                            loading="lazy"
                            class="expandable-img rounded-img"
                            style="
                                height:180px;
                                width:100%;
                                object-fit:cover;
                                margin-bottom:10px;
                            "
                            onerror="this.style.display='none'"
                        >
                    `
                    : ''
                }

                <span
                    style="
                        color:var(--gold);
                        font-size:0.85rem;
                        font-weight:600;
                    "
                >
                    ${escapeHtml(p.date)}
                </span>

                <h4 style="margin:5px 0;">
                    ${escapeHtml(p.title)}
                </h4>

                <p
                    style="
                        font-size:0.9rem;
                        color:var(--text-muted);
                    "
                >
                    ${escapeHtml(p.description)}
                </p>

            </div>

        `).join('');

}


// =========================================================
// NEWS
// =========================================================

function renderNews(news) {

    const container =
        document.getElementById(
            'newsContainer'
        );

    if (!container) return;


    if (
        !news ||
        news.length === 0
    ) {

        container.innerHTML =
            `<p>No updates published yet.</p>`;

        return;

    }


    container.innerHTML =
        news.map(n => `

            <div class="card">

                ${
                    n.imageUrl
                    ? `
                        <img
                            src="${escapeAttribute(n.imageUrl)}"
                            loading="lazy"
                            class="expandable-img rounded-img"
                            style="
                                height:200px;
                                width:100%;
                                object-fit:cover;
                                margin-bottom:10px;
                            "
                            onerror="this.style.display='none'"
                        >
                    `
                    : ''
                }

                <h4>
                    ${escapeHtml(n.title)}
                </h4>

                <p
                    style="
                        font-size:0.9rem;
                        color:var(--text-muted);
                        margin-top:5px;
                    "
                >
                    ${escapeHtml(n.content)}
                </p>

                <small
                    style="
                        color:var(--gold);
                        margin-top:10px;
                        display:block;
                    "
                >
                    Posted on:
                    ${escapeHtml(n.date)}
                </small>

            </div>

        `).join('');

}


// =========================================================
// EXECUTIVES
// =========================================================

function renderExecutives(execs) {

    const container =
        document.getElementById(
            'executivesContainer'
        );

    if (
        !container ||
        !execs ||
        execs.length === 0
    ) {
        return;
    }


    container.innerHTML =
        execs.map(e => `

            <div
                class="card"
                style="text-align:center;"
            >

                <img
                    src="${escapeAttribute(
                        e.imageUrl ||
                        'about-image.jpg'
                    )}"
                    loading="lazy"
                    class="expandable-img"
                    style="
                        width:100px;
                        height:100px;
                        border-radius:50%;
                        object-fit:cover;
                        margin:0 auto 10px;
                        border:2px solid var(--gold);
                    "
                    onerror="this.src='about-image.jpg'"
                >

                <h4>
                    ${escapeHtml(e.name)}
                </h4>

                <p
                    style="
                        color:var(--gold);
                        font-size:0.85rem;
                        font-weight:600;
                    "
                >
                    ${escapeHtml(e.position)}
                </p>

                <p
                    style="
                        font-size:0.8rem;
                        color:var(--text-muted);
                        margin:5px 0;
                    "
                >
                    ${escapeHtml(e.bio || '')}
                </p>

                <a
                    href="mailto:${escapeAttribute(e.email || '')}"
                    style="
                        font-size:0.8rem;
                        color:var(--primary-green);
                        text-decoration:none;
                    "
                >
                    <i class="fas fa-envelope"></i>
                    ${escapeHtml(e.email || '')}
                </a>

            </div>

        `).join('');

}


// =========================================================
// SMS SIGNUP
// =========================================================

async function handleSmsSignup(e) {

    e.preventDefault();


    const name =
        document.getElementById(
            'smsName'
        ).value.trim();

    const phone =
        document.getElementById(
            'smsPhone'
        ).value.trim();


    const payload = {

        action:
            'addSmsMember',

        name,
        phone

    };


    const result =
        await submitToSheets(
            payload,
            "Subscribed successfully to GMSA SMS alerts!"
        );


    if (
        result &&
        result.status === 'success'
    ) {

        e.target.reset();

    }

}


// =========================================================
// FEEDBACK
// =========================================================

async function handleFeedbackSubmit(e) {

    e.preventDefault();


    const name =
        document.getElementById(
            'fbName'
        ).value.trim();

    const contact =
        document.getElementById(
            'fbContact'
        ).value.trim();

    const message =
        document.getElementById(
            'fbMessage'
        ).value.trim();


    const photoUrlInput =
        document.getElementById(
            'fbPhotoUrl'
        );


    const fileUrl =
        photoUrlInput
            ? photoUrlInput.value.trim()
            : "";


    const payload = {

        action:
            'addFeedback',

        name,
        contact,
        message,
        fileUrl

    };


    const result =
        await submitToSheets(
            payload,
            "Thank you! Your feedback has been sent."
        );


    if (
        result &&
        result.status === 'success'
    ) {

        e.target.reset();

    }

}


// =========================================================
// GOOGLE SHEETS SUBMISSION
// =========================================================

async function submitToSheets(
    payload,
    successMsg
) {

    try {

        const res =
            await fetch(
                SCRIPT_URL,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'text/plain'
                    },

                    body:
                        JSON.stringify(payload)

                }
            );


        const result =
            await res.json();


        if (
            result &&
            result.status === 'success'
        ) {

            alert(successMsg);

        } else {

            alert(
                result.message ||
                "Action could not be completed."
            );

        }


        return result;


    } catch (err) {

        console.error(
            "Submission error:",
            err
        );

        alert(
            "Unable to connect to the server. Please try again."
        );

        return {
            status: 'error',
            message: err.toString()
        };

    }

}


// =========================================================
// PAYSTACK PAYMENT SYSTEM
// =========================================================

function initPaymentForms() {

    const duesForm =
        document.getElementById(
            'duesPaymentForm'
        );

    const donationForm =
        document.getElementById(
            'donationPaymentForm'
        );


    if (duesForm) {

        duesForm.addEventListener(
            'submit',
            handleDuesPayment
        );

    }


    if (donationForm) {

        donationForm.addEventListener(
            'submit',
            handleDonationPayment
        );

    }

}


// =========================================================
// DUES PAYMENT
// =========================================================

async function handleDuesPayment(e) {

    e.preventDefault();


    const name =
        document.getElementById(
            'paymentDuesName'
        ).value.trim();

    const indexNo =
        document.getElementById(
            'paymentDuesIndex'
        ).value.trim();

    const email =
        document.getElementById(
            'paymentDuesEmail'
        ).value.trim();

    const phone =
        document.getElementById(
            'paymentDuesPhone'
        ).value.trim();

    const amount =
        Number(
            document.getElementById(
                'paymentDuesAmount'
            ).value
        );


    if (
        !name ||
        !indexNo ||
        !email ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        alert(
            "Please provide valid payment details."
        );

        return;

    }


    const button =
        document.getElementById(
            'duesPayButton'
        );


    setPaymentButtonLoading(
        button,
        true,
        "Initializing..."
    );


    try {

        const result =
            await callBackend({

                action:
                    'initializePayment',

                paymentType:
                    'dues',

                name,
                indexNo,
                email,
                phone,

                amount:

                    Math.round(
                        amount * 100
                    ),

                callbackUrl:
                    window.location.origin +
                    window.location.pathname

            });


        if (
            result.status !== 'success' ||
            !result.authorization_url
        ) {

            throw new Error(
                result.message ||
                "Unable to initialize payment."
            );

        }


        window.location.href =
            result.authorization_url;


    } catch (err) {

        console.error(
            "Dues payment error:",
            err
        );

        showPaymentStatus(
            err.message ||
            "Unable to initialize payment.",
            "error"
        );

        setPaymentButtonLoading(
            button,
            false,
            "Pay Dues"
        );

    }

}


// =========================================================
// DONATION PAYMENT
// =========================================================

async function handleDonationPayment(e) {

    e.preventDefault();


    const name =
        document.getElementById(
            'donationName'
        ).value.trim();

    const email =
        document.getElementById(
            'donationEmail'
        ).value.trim();

    const phone =
        document.getElementById(
            'donationPhone'
        ).value.trim();

    const purpose =
        document.getElementById(
            'donationPurpose'
        ).value.trim();

    const amount =
        Number(
            document.getElementById(
                'donationAmount'
            ).value
        );


    if (
        !name ||
        !email ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        alert(
            "Please provide a valid name, email and amount."
        );

        return;

    }


    const button =
        document.getElementById(
            'donationPayButton'
        );


    setPaymentButtonLoading(
        button,
        true,
        "Initializing..."
    );


    try {

        const result =
            await callBackend({

                action:
                    'initializePayment',

                paymentType:
                    'donation',

                name,
                email,
                phone,
                purpose,

                amount:

                    Math.round(
                        amount * 100
                    ),

                callbackUrl:
                    window.location.origin +
                    window.location.pathname

            });


        if (
            result.status !== 'success' ||
            !result.authorization_url
        ) {

            throw new Error(
                result.message ||
                "Unable to initialize donation."
            );

        }


        window.location.href =
            result.authorization_url;


    } catch (err) {

        console.error(
            "Donation payment error:",
            err
        );

        showPaymentStatus(
            err.message ||
            "Unable to initialize donation.",
            "error"
        );

        setPaymentButtonLoading(
            button,
            false,
            "Donate Now"
        );

    }

}


// =========================================================
// PAYSTACK CALLBACK
// =========================================================

async function handlePaystackCallback() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const reference =
        params.get(
            'reference'
        );


    if (!reference) return;


    const statusBox =
        document.getElementById(
            'paymentStatus'
        );


    if (statusBox) {

        statusBox.innerHTML = `
            <div class="payment-status-loading">
                <i class="fas fa-spinner fa-spin"></i>
                Verifying your payment...
            </div>
        `;

        statusBox.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

    }


    try {

        const result =
            await callBackend({

                action:
                    'verifyPayment',

                reference

            });


        if (
            result.status === 'success' &&
            result.payment_status === 'success'
        ) {

            showPaymentStatus(
                result.message ||
                "Payment successful. Thank you!",
                "success"
            );


            // Remove reference from address bar
            // without refreshing.
            const cleanUrl =
                window.location.origin +
                window.location.pathname +
                '#support';

            window.history.replaceState(
                {},
                document.title,
                cleanUrl
            );


        } else {

            showPaymentStatus(
                result.message ||
                "Payment could not be verified.",
                "error"
            );

        }


    } catch (err) {

        console.error(
            "Payment verification error:",
            err
        );

        showPaymentStatus(
            "We could not verify this payment right now. Please contact GMSA with your payment reference.",
            "error"
        );

    }

}


// =========================================================
// BACKEND CALL
// =========================================================

async function callBackend(payload) {

    const response =
        await fetch(
            SCRIPT_URL,
            {
                method: 'POST',

                headers: {
                    'Content-Type':
                        'text/plain'
                },

                body:
                    JSON.stringify(payload)

            }
        );


    return await response.json();

}


// =========================================================
// PAYMENT UI
// =========================================================

function setPaymentButtonLoading(
    button,
    loading,
    text
) {

    if (!button) return;


    button.disabled =
        loading;


    if (loading) {

        button.dataset.originalText =
            button.innerHTML;

        button.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            ${text}
        `;

    } else {

        button.innerHTML =
            button.dataset.originalText ||
            text;

    }

}


function showPaymentStatus(
    message,
    type
) {

    const statusBox =
        document.getElementById(
            'paymentStatus'
        );

    if (!statusBox) {

        alert(message);

        return;

    }


    statusBox.className =
        `payment-status ${type}`;


    statusBox.innerHTML = `

        <div class="payment-status-inner">

            <i class="
                fas
                ${
                    type === 'success'
                    ? 'fa-circle-check'
                    : 'fa-circle-exclamation'
                }
            "></i>

            <span>
                ${escapeHtml(message)}
            </span>

        </div>

    `;


    statusBox.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });

}


// =========================================================
// HTML SAFETY HELPERS
// =========================================================

function escapeHtml(value) {

    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

}


function escapeAttribute(value) {

    return escapeHtml(value);

}