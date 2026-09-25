// =========================================================
// GMSA UDS TLC — ADMIN JAVASCRIPT
// =========================================================

const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwcakG7FuBQsnEjKoyts73Iuz3RPHqN3UVSPQ0TcO9TiPm0YHpQL6GySFYZbzReicr8SQ/exec";


let globalData = {};

let uploadedContacts = [];


// =========================================================
// INITIALIZATION
// =========================================================

document.addEventListener(
    'DOMContentLoaded',
    () => {

        initClock();

        initAdminTheme();

        initSmsRecipientUI();

        initSmsMessagePreview();

        initExcelUpload();

        initPaymentFilter();

        loadAdminData();


        const formMap = {

            duesForm:
                (e) =>
                    handleForm(
                        e,
                        'addDues'
                    ),

            programForm:
                (e) =>
                    handleFormWithUrl(
                        e,
                        'addProgram'
                    ),

            newsForm:
                (e) =>
                    handleFormWithUrl(
                        e,
                        'addNews'
                    ),

            execForm:
                (e) =>
                    handleFormWithUrl(
                        e,
                        'addExecutive'
                    ),

            prayerForm:
                (e) =>
                    handleForm(
                        e,
                        'updatePrayers'
                    ),

            reminderForm:
                (e) =>
                    handleFormWithUrl(
                        e,
                        'updateReminder'
                    ),

            smsPortalForm:
                handleHubtelSms,

            smsSettingsForm:
                handleSaveSmsSettings,

            editItemForm:
                handleEditSubmit

        };


        Object.entries(formMap)
            .forEach(
                ([id, handler]) => {

                    const el =
                        document.getElementById(id);

                    if (el) {

                        el.addEventListener(
                            'submit',
                            handler
                        );

                    }

                }
            );

    }
);


// =========================================================
// CLOCK
// =========================================================

function initClock() {

    const clock =
        document.getElementById(
            'liveClockDisplay'
        );

    if (!clock) return;


    const updateTime = () => {

        const now =
            new Date();

        clock.innerText =
            `${now.toLocaleTimeString()} | ${now.toLocaleDateString()}`;

    };


    updateTime();

    setInterval(
        updateTime,
        1000
    );

}


// =========================================================
// TAB SWITCHING
// =========================================================

function showTab(tabId) {

    const tabs =
        document.querySelectorAll(
            '.tab-content'
        );

    const menuItems =
        document.querySelectorAll(
            '.sidebar-menu li'
        );


    tabs.forEach(
        el =>
            el.classList.remove(
                'active'
            )
    );


    menuItems.forEach(
        el =>
            el.classList.remove(
                'active'
            )
    );


    const targetTab =
        document.getElementById(
            `tab-${tabId}`
        );


    if (targetTab) {

        targetTab.classList.add(
            'active'
        );

    }


    const clicked =
        menuItems[
            [
                'dashboard',
                'dues',
                'payments',
                'programs',
                'news',
                'execs',
                'prayers',
                'reminder',
                'sms',
                'feedback'
            ].indexOf(tabId)
        ];


    if (clicked) {

        clicked.classList.add(
            'active'
        );

    }

}


// =========================================================
// THEME
// =========================================================

function initAdminTheme() {

    const btn =
        document.getElementById(
            'adminThemeToggle'
        );


    const saved =
        localStorage.getItem(
            'gmsa_admin_theme'
        ) || 'light';


    document.documentElement.setAttribute(
        'data-theme',
        saved
    );


    if (btn) {

        btn.addEventListener(
            'click',
            () => {

                const current =
                    document.documentElement
                        .getAttribute(
                            'data-theme'
                        );


                const next =
                    current === 'dark'
                        ? 'light'
                        : 'dark';


                document.documentElement
                    .setAttribute(
                        'data-theme',
                        next
                    );


                localStorage.setItem(
                    'gmsa_admin_theme',
                    next
                );

            }
        );

    }

}


// =========================================================
// LOAD ADMIN DATA
// =========================================================

async function loadAdminData() {

    try {

        const res =
            await fetch(
                `${SCRIPT_URL}?action=getData&_=${Date.now()}`,
                {
                    cache:
                        'no-store'
                }
            );


        globalData =
            await res.json();


        renderAdminPrograms(
            globalData.programs
        );

        renderAdminNews(
            globalData.news
        );

        renderAdminExecs(
            globalData.executives
        );

        renderAdminFeedback(
            globalData.feedback
        );

        renderAdminPayments(
            globalData.payments
        );

        populateSmsSettings(
            globalData.smsSettings
        );

        updatePaymentDashboard(
            globalData.payments
        );


    } catch (e) {

        console.error(
            "Error loading admin data:",
            e
        );

    }

}


// =========================================================
// SMS SETTINGS
// =========================================================

function populateSmsSettings(settings) {

    if (!settings) return;


    const setVal =
        (
            id,
            val
        ) => {

            const el =
                document.getElementById(
                    id
                );

            if (el) {

                el.value =
                    val || '';

            }

        };


    setVal(
        'smsClientId',
        settings.clientId
    );

    setVal(
        'smsClientSecret',
        settings.clientSecret
    );

    setVal(
        'smsSenderId',
        settings.senderId
    );

}


// =========================================================
// PROGRAMS
// =========================================================

function renderAdminPrograms(
    progList
) {

    const container =
        document.getElementById(
            'adminProgramsList'
        );

    if (!container) return;


    if (
        !progList ||
        !progList.length
    ) {

        container.innerHTML =
            "<p>No programs available.</p>";

        return;

    }


    let html = '';


    for (
        let i = 0;
        i < progList.length;
        i++
    ) {

        const p =
            progList[i];


        html += `

            <div class="card">

                ${
                    p.imageUrl
                    ?
                    `
                        <img
                            src="${escapeAttribute(p.imageUrl)}"
                            style="
                                width:100%;
                                height:160px;
                                object-fit:cover;
                                border-radius:6px;
                                margin-bottom:10px;
                            "
                            onerror="
                                this.style.display='none'
                            "
                        >
                    `
                    :
                    ''
                }


                <h4>
                    ${escapeHtml(p.title)}
                    (${escapeHtml(p.date)})
                </h4>


                <p
                    style="
                        font-size:0.85rem;
                        color:var(--text-color);
                        margin:5px 0;
                    "
                >
                    ${escapeHtml(p.description)}
                </p>


                <div
                    style="
                        display:flex;
                        gap:10px;
                    "
                >

                    <button
                        class="btn btn-edit"
                        onclick="
                            openEditModal(
                                'Programs',
                                '${escapeJs(p.id)}'
                            )
                        "
                    >
                        <i class="fas fa-edit"></i>
                        Edit
                    </button>


                    <button
                        class="btn btn-delete"
                        onclick="
                            deleteItem(
                                'Programs',
                                '${escapeJs(p.id)}'
                            )
                        "
                    >
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>

                </div>

            </div>

        `;

    }


    container.innerHTML =
        html;

}


// =========================================================
// NEWS
// =========================================================

function renderAdminNews(
    newsList
) {

    const container =
        document.getElementById(
            'adminNewsList'
        );

    if (!container) return;


    if (
        !newsList ||
        !newsList.length
    ) {

        container.innerHTML =
            "<p>No news posts published yet.</p>";

        return;

    }


    let html = '';


    for (
        let i = 0;
        i < newsList.length;
        i++
    ) {

        const n =
            newsList[i];


        html += `

            <div class="card">

                ${
                    n.imageUrl
                    ?
                    `
                        <img
                            src="${escapeAttribute(n.imageUrl)}"
                            style="
                                width:100%;
                                height:160px;
                                object-fit:cover;
                                border-radius:6px;
                                margin-bottom:10px;
                            "
                            onerror="
                                this.style.display='none'
                            "
                        >
                    `
                    :
                    ''
                }


                <h4>
                    ${escapeHtml(n.title)}
                </h4>


                <p
                    style="
                        font-size:0.85rem;
                        color:var(--text-color);
                        margin:5px 0;
                    "
                >
                    ${escapeHtml(n.content)}
                </p>


                <div
                    style="
                        display:flex;
                        gap:10px;
                    "
                >

                    <button
                        class="btn btn-edit"
                        onclick="
                            openEditModal(
                                'News',
                                '${escapeJs(n.id)}'
                            )
                        "
                    >
                        <i class="fas fa-edit"></i>
                        Edit
                    </button>


                    <button
                        class="btn btn-delete"
                        onclick="
                            deleteItem(
                                'News',
                                '${escapeJs(n.id)}'
                            )
                        "
                    >
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>

                </div>

            </div>

        `;

    }


    container.innerHTML =
        html;

}


// =========================================================
// EXECUTIVES
// =========================================================

function renderAdminExecs(
    execList
) {

    const container =
        document.getElementById(
            'adminExecList'
        );

    if (!container) return;


    if (
        !execList ||
        !execList.length
    ) {

        container.innerHTML =
            "<p>No executives added.</p>";

        return;

    }


    let html = '';


    for (
        let i = 0;
        i < execList.length;
        i++
    ) {

        const e =
            execList[i];


        html += `

            <div class="card">

                <img
                    src="${escapeAttribute(
                        e.imageUrl ||
                        'about-image.jpg'
                    )}"
                    style="
                        width:70px;
                        height:70px;
                        border-radius:50%;
                        object-fit:cover;
                        margin-bottom:10px;
                    "
                    onerror="
                        this.src='about-image.jpg'
                    "
                >


                <h4>
                    ${escapeHtml(e.name)}
                </h4>


                <p
                    style="
                        color:var(--gold);
                        font-size:0.85rem;
                    "
                >
                    ${escapeHtml(e.position)}
                </p>


                <div
                    style="
                        display:flex;
                        gap:10px;
                        margin-top:10px;
                    "
                >

                    <button
                        class="btn btn-edit"
                        onclick="
                            openEditModal(
                                'Executives',
                                '${escapeJs(e.id)}'
                            )
                        "
                    >
                        <i class="fas fa-edit"></i>
                        Edit
                    </button>


                    <button
                        class="btn btn-delete"
                        onclick="
                            deleteItem(
                                'Executives',
                                '${escapeJs(e.id)}'
                            )
                        "
                    >
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>

                </div>

            </div>

        `;

    }


    container.innerHTML =
        html;

}


// =========================================================
// FEEDBACK
// =========================================================

function renderAdminFeedback(
    feedbackList
) {

    const container =
        document.getElementById(
            'feedbackContainer'
        );

    if (!container) return;


    if (
        !feedbackList ||
        !feedbackList.length
    ) {

        container.innerHTML =
            "<p>No feedback received yet.</p>";

        return;

    }


    let html = '';


    for (
        let i = 0;
        i < feedbackList.length;
        i++
    ) {

        const f =
            feedbackList[i];


        html += `

            <div class="card">

                <h4>
                    From:
                    ${escapeHtml(
                        f.name ||
                        'Anonymous'
                    )}

                    (
                    ${escapeHtml(
                        f.contact ||
                        'No contact'
                    )}
                    )
                </h4>


                <p style="margin:5px 0;">
                    ${escapeHtml(
                        f.message
                    )}
                </p>


                ${
                    f.fileUrl
                    ?
                    `
                        <img
                            src="${escapeAttribute(f.fileUrl)}"
                            style="
                                width:100%;
                                height:150px;
                                object-fit:cover;
                                border-radius:6px;
                                margin-top:10px;
                            "
                            onerror="
                                this.style.display='none'
                            "
                        >
                    `
                    :
                    ''
                }

            </div>

        `;

    }


    container.innerHTML =
        html;

}


// =========================================================
// PAYMENT RECORDS
// =========================================================

function renderAdminPayments(
    paymentList
) {

    const container =
        document.getElementById(
            'adminPaymentsList'
        );

    if (!container) return;


    const filter =
        document.getElementById(
            'paymentTypeFilter'
        );


    const selected =
        filter
            ? filter.value
            : 'all';


    let records =
        Array.isArray(paymentList)
            ? paymentList
            : [];


    if (
        selected !== 'all'
    ) {

        records =
            records.filter(
                item =>
                    String(
                        item.paymentType ||
                        ''
                    ).toLowerCase() ===
                    selected
            );

    }


    if (!records.length) {

        container.innerHTML =
            `
                <div class="card">
                    <p>
                        No payment records found.
                    </p>
                </div>
            `;

        return;

    }


    let html = '';


    records
        .slice()
        .reverse()
        .forEach(
            p => {

                const amount =
                    (
                        Number(
                            p.amount || 0
                        ) / 100
                    ).toFixed(2);


                const type =
                    String(
                        p.paymentType ||
                        ''
                    ).toLowerCase();


                html += `

                    <div class="payment-record-card">

                        <div class="payment-record-top">

                            <span
                                class="payment-record-type"
                            >

                                <i class="
                                    fas
                                    ${
                                        type === 'donation'
                                        ? 'fa-heart'
                                        : 'fa-id-card'
                                    }
                                "></i>

                                ${
                                    type === 'donation'
                                    ? 'Donation'
                                    : 'GMSA Dues'
                                }

                            </span>


                            <span
                                class="payment-record-status"
                            >
                                ${escapeHtml(
                                    p.status ||
                                    'success'
                                )}
                            </span>

                        </div>


                        <div class="payment-record-amount">

                            GHS
                            ${amount}

                        </div>


                        <div
                            class="payment-record-info"
                        >

                            <div>
                                <strong>Name:</strong>
                                ${escapeHtml(
                                    p.name ||
                                    ''
                                )}
                            </div>


                            <div>
                                <strong>Email:</strong>
                                ${escapeHtml(
                                    p.email ||
                                    ''
                                )}
                            </div>


                            ${
                                p.indexNo
                                ?
                                `
                                    <div>
                                        <strong>Student ID:</strong>
                                        ${escapeHtml(
                                            p.indexNo
                                        )}
                                    </div>
                                `
                                :
                                ''
                            }


                            ${
                                p.purpose
                                ?
                                `
                                    <div>
                                        <strong>Purpose:</strong>
                                        ${escapeHtml(
                                            p.purpose
                                        )}
                                    </div>
                                `
                                :
                                ''
                            }


                            <div>
                                <strong>Date:</strong>
                                ${escapeHtml(
                                    p.date ||
                                    ''
                                )}
                            </div>

                        </div>


                        <div
                            class="payment-reference"
                        >

                            Reference:
                            ${escapeHtml(
                                p.reference ||
                                ''
                            )}

                        </div>

                    </div>

                `;

            }
        );


    container.innerHTML =
        html;

}


function updatePaymentDashboard(
    paymentList
) {

    const records =
        Array.isArray(paymentList)
            ? paymentList
            : [];


    let dues =
        0;

    let donations =
        0;

    let count =
        0;


    records.forEach(
        p => {

            if (
                String(
                    p.status ||
                    ''
                ).toLowerCase() !==
                'success'
            ) {
                return;
            }


            count++;


            const amount =
                Number(
                    p.amount || 0
                ) / 100;


            if (
                String(
                    p.paymentType ||
                    ''
                ).toLowerCase() ===
                'donation'
            ) {

                donations +=
                    amount;

            } else {

                dues +=
                    amount;

            }

        }
    );


    const duesEl =
        document.getElementById(
            'dashboardDuesTotal'
        );

    const donationEl =
        document.getElementById(
            'dashboardDonationTotal'
        );

    const countEl =
        document.getElementById(
            'dashboardPaymentCount'
        );


    if (duesEl) {

        duesEl.innerText =
            `GHS ${dues.toFixed(2)}`;

    }


    if (donationEl) {

        donationEl.innerText =
            `GHS ${donations.toFixed(2)}`;

    }


    if (countEl) {

        countEl.innerText =
            count.toLocaleString();

    }

}


// =========================================================
// PAYMENT FILTER
// =========================================================

function initPaymentFilter() {

    const filter =
        document.getElementById(
            'paymentTypeFilter'
        );


    if (!filter) return;


    filter.addEventListener(
        'change',
        () => {

            renderAdminPayments(
                globalData.payments
            );

        }
    );

}


// =========================================================
// EDIT MODAL
// =========================================================

function openEditModal(
    sheetName,
    id
) {

    document.getElementById(
        'editItemSheet'
    ).value =
        sheetName;


    document.getElementById(
        'editItemId'
    ).value =
        id;


    const fieldsContainer =
        document.getElementById(
            'editDynamicFields'
        );


    fieldsContainer.innerHTML =
        '';


    if (
        sheetName === 'News'
    ) {

        const item =
            globalData.news.find(
                n => n.id == id
            );


        if (!item) return;


        document.getElementById(
            'editModalTitle'
        ).innerText =
            "Edit News Post";


        document.getElementById(
            'editItemPhotoUrl'
        ).value =
            item.imageUrl ||
            '';


        fieldsContainer.innerHTML = `

            <input
                type="text"
                id="editTitle"
                value="${escapeAttribute(item.title)}"
                placeholder="Headline"
                required
            >


            <textarea
                id="editContent"
                rows="4"
                placeholder="Content"
                required
            >${escapeHtml(item.content)}</textarea>

        `;


    } else if (
        sheetName === 'Programs'
    ) {

        const item =
            globalData.programs.find(
                p => p.id == id
            );


        if (!item) return;


        document.getElementById(
            'editModalTitle'
        ).innerText =
            "Edit Program";


        document.getElementById(
            'editItemPhotoUrl'
        ).value =
            item.imageUrl ||
            '';


        fieldsContainer.innerHTML = `

            <input
                type="text"
                id="editTitle"
                value="${escapeAttribute(item.title)}"
                placeholder="Program Title"
                required
            >


            <input
                type="date"
                id="editDate"
                value="${escapeAttribute(item.date)}"
                required
            >


            <textarea
                id="editContent"
                rows="4"
                placeholder="Description"
                required
            >${escapeHtml(item.description)}</textarea>

        `;


    } else if (
        sheetName === 'Executives'
    ) {

        const item =
            globalData.executives.find(
                e => e.id == id
            );


        if (!item) return;


        document.getElementById(
            'editModalTitle'
        ).innerText =
            "Edit Executive";


        document.getElementById(
            'editItemPhotoUrl'
        ).value =
            item.imageUrl ||
            '';


        fieldsContainer.innerHTML = `

            <input
                type="text"
                id="editName"
                value="${escapeAttribute(item.name)}"
                placeholder="Name"
                required
            >


            <input
                type="text"
                id="editPos"
                value="${escapeAttribute(item.position)}"
                placeholder="Position"
                required
            >


            <input
                type="email"
                id="editEmail"
                value="${escapeAttribute(item.email)}"
                placeholder="Email"
                required
            >


            <textarea
                id="editBio"
                rows="3"
                placeholder="Bio"
            >${escapeHtml(item.bio || '')}</textarea>

        `;

    }


    document.getElementById(
        'editModal'
    ).style.display =
        'flex';

}


function closeEditModal() {

    document.getElementById(
        'editModal'
    ).style.display =
        'none';

}


// =========================================================
// EDIT SUBMIT
// =========================================================

async function handleEditSubmit(e) {

    e.preventDefault();


    const sheetName =
        document.getElementById(
            'editItemSheet'
        ).value;


    const id =
        document.getElementById(
            'editItemId'
        ).value;


    const imageUrl =
        document.getElementById(
            'editItemPhotoUrl'
        ).value;


    const payload = {

        action:
            'editItem',

        sheetName,

        id,

        imageUrl

    };


    if (
        sheetName === 'News'
    ) {

        payload.title =
            document.getElementById(
                'editTitle'
            ).value;

        payload.content =
            document.getElementById(
                'editContent'
            ).value;


    } else if (
        sheetName === 'Programs'
    ) {

        payload.title =
            document.getElementById(
                'editTitle'
            ).value;

        payload.date =
            document.getElementById(
                'editDate'
            ).value;

        payload.description =
            document.getElementById(
                'editContent'
            ).value;


    } else if (
        sheetName === 'Executives'
    ) {

        payload.name =
            document.getElementById(
                'editName'
            ).value;

        payload.position =
            document.getElementById(
                'editPos'
            ).value;

        payload.email =
            document.getElementById(
                'editEmail'
            ).value;

        payload.bio =
            document.getElementById(
                'editBio'
            ).value;

    }


    closeEditModal();


    const result =
        await sendToBackend(
            payload
        );


    if (
        result.status ===
        'success'
    ) {

        alert(
            "Changes saved successfully."
        );

        loadAdminData();

    } else {

        alert(
            result.message ||
            "Unable to save changes."
        );

    }

}


// =========================================================
// DELETE
// =========================================================

async function deleteItem(
    sheetName,
    id
) {

    if (
        !confirm(
            "Are you sure you want to delete this item?"
        )
    ) {

        return;

    }


    const result =
        await sendToBackend({

            action:
                'deleteItem',

            sheetName,

            id

        });


    if (
        result.status ===
        'success'
    ) {

        loadAdminData();

    } else {

        alert(
            result.message ||
            "Unable to delete item."
        );

    }

}


// =========================================================
// NORMAL FORM
// =========================================================

async function handleForm(
    e,
    action
) {

    e.preventDefault();


    const formData =
        new FormData(
            e.target
        );


    const data =
        Object.fromEntries(
            formData.entries()
        );


    data.action =
        action;


    const result =
        await sendToBackend(
            data
        );


    if (
        result.status ===
        'success'
    ) {

        alert(
            "Action completed successfully."
        );

        e.target.reset();

        loadAdminData();

    } else {

        alert(
            result.message ||
            "Action failed."
        );

    }

}


// =========================================================
// FORM WITH IMAGE URL
// =========================================================

async function handleFormWithUrl(
    e,
    action
) {

    e.preventDefault();


    const form =
        e.target;


    const data = {
        action
    };


    const elements =
        form.elements;


    for (
        let i = 0;
        i < elements.length;
        i++
    ) {

        const input =
            elements[i];


        if (
            input.id ||
            input.name
        ) {

            data[
                input.id ||
                input.name
            ] =
                input.value;

        }

    }


    data.imageUrl =
        data.progPhotoUrl ||
        data.newsPhotoUrl ||
        data.execPhotoUrl ||
        data.reminderPhotoUrl ||
        "";


    const result =
        await sendToBackend(
            data
        );


    if (
        result.status ===
        'success'
    ) {

        alert(
            "Action completed successfully."
        );

        form.reset();

        loadAdminData();

    } else {

        alert(
            result.message ||
            "Action failed."
        );

    }

}


// =========================================================
// MUSLIM COUNT
// =========================================================

async function updateMuslimCount() {

    const countInput =
        document.getElementById(
            'muslimCountInput'
        );


    if (
        !countInput ||
        !countInput.value
    ) {

        return;

    }


    const result =
        await sendToBackend({

            action:
                'updateMuslimCount',

            count:
                countInput.value

        });


    if (
        result.status ===
        'success'
    ) {

        alert(
            "Muslim count updated successfully."
        );

    } else {

        alert(
            result.message ||
            "Unable to update count."
        );

    }

}


// =========================================================
// HUBTEL SETTINGS
// =========================================================

async function handleSaveSmsSettings(e) {

    e.preventDefault();


    const clientId =
        document.getElementById(
            'smsClientId'
        ).value.trim();


    const clientSecret =
        document.getElementById(
            'smsClientSecret'
        ).value.trim();


    const senderId =
        document.getElementById(
            'smsSenderId'
        ).value.trim();


    if (
        !clientId ||
        !clientSecret ||
        !senderId
    ) {

        alert(
            "Please enter Client ID, Client Secret and Sender ID."
        );

        return;

    }


    const res =
        await sendToBackend({

            action:
                'updateSmsSettings',

            clientId,

            clientSecret,

            senderId

        });


    if (
        res &&
        res.status ===
        'success'
    ) {

        alert(
            "Hubtel developer credentials and Sender ID saved successfully."
        );

    } else {

        alert(
            res.message ||
            "Failed to save SMS settings."
        );

    }

}


// =========================================================
// SMS RECIPIENT UI
// =========================================================

function initSmsRecipientUI() {

    const typeSelect =
        document.getElementById(
            'smsRecipientType'
        );


    if (!typeSelect) return;


    typeSelect.addEventListener(
        'change',
        updateSmsRecipientUI
    );


    updateSmsRecipientUI();

}


function updateSmsRecipientUI() {

    const type =
        document.getElementById(
            'smsRecipientType'
        )?.value ||
        'all';


    const singleGroup =
        document.getElementById(
            'singlePhoneGroup'
        );


    const excelGroup =
        document.getElementById(
            'excelUploadGroup'
        );


    if (singleGroup) {

        singleGroup.style.display =
            type === 'single'
                ? 'flex'
                : 'none';

    }


    if (excelGroup) {

        excelGroup.style.display =
            type === 'excel'
                ? 'flex'
                : 'none';

    }


    updateSmsPreview();

}


// =========================================================
// SMS MESSAGE PREVIEW
// =========================================================

function initSmsMessagePreview() {

    const message =
        document.getElementById(
            'smsMessage'
        );


    if (!message) return;


    message.addEventListener(
        'input',
        updateSmsPreview
    );


    updateSmsPreview();

}


function updateSmsPreview() {

    const message =
        document.getElementById(
            'smsMessage'
        );


    const preview =
        document.getElementById(
            'smsPreview'
        );


    const count =
        document.getElementById(
            'smsCharacterCount'
        );


    if (!message) return;


    const text =
        message.value ||
        '';


    if (count) {

        count.innerText =
            `${text.length} characters`;

    }


    if (!preview) return;


    const name =
        document.getElementById(
            'smsSingleName'
        )?.value ||
        'Abdul-Aziz';


    preview.innerText =
        personalizeMessage(
            text,
            name
        ) ||
        'Your personalized message preview will appear here.';

}


// =========================================================
// EXCEL UPLOAD
// =========================================================

function initExcelUpload() {

    const fileInput =
        document.getElementById(
            'smsExcelFile'
        );


    if (!fileInput) return;


    fileInput.addEventListener(
        'change',
        handleExcelUpload
    );

}


async function handleExcelUpload(e) {

    const file =
        e.target.files[0];


    if (!file) return;


    const preview =
        document.getElementById(
            'excelContactPreview'
        );


    if (preview) {

        preview.innerHTML = `
            <p>
                <i class="fas fa-spinner fa-spin"></i>
                Reading contacts...
            </p>
        `;

    }


    try {

        const buffer =
            await file.arrayBuffer();


        const workbook =
            XLSX.read(
                buffer,
                {
                    type: 'array'
                }
            );


        const firstSheet =
            workbook.Sheets[
                workbook.SheetNames[0]
            ];


        const rows =
            XLSX.utils.sheet_to_json(
                firstSheet,
                {
                    defval: ''
                }
            );


        uploadedContacts =
            normalizeExcelContacts(
                rows
            );


        renderExcelPreview(
            uploadedContacts
        );


        updateSmsPreview();


    } catch (err) {

        console.error(
            "Excel error:",
            err
        );


        uploadedContacts =
            [];


        if (preview) {

            preview.innerHTML = `
                <p style="color:#e11d48;">
                    Unable to read this file.
                    Please upload a valid Excel or CSV file.
                </p>
            `;

        }

    }

}


// =========================================================
// EXCEL CONTACT NORMALIZATION
// =========================================================

function normalizeExcelContacts(
    rows
) {

    const contacts = [];


    if (
        !Array.isArray(rows)
    ) {

        return contacts;

    }


    rows.forEach(
        row => {

            const keys =
                Object.keys(row);


            const findValue =
                (
                    candidates
                ) => {

                    const key =
                        keys.find(
                            k =>
                                candidates.includes(
                                    normalizeHeader(k)
                                )
                        );


                    return key
                        ? String(
                            row[key] ??
                            ''
                        ).trim()
                        : '';

                };


            const name =
                findValue([
                    'name',
                    'fullname',
                    'full name',
                    'recipientname',
                    'recipient name',
                    'studentname',
                    'student name',
                    'contactname',
                    'contact name'
                ]);


            const phone =
                findValue([
                    'phone',
                    'phonenumber',
                    'phone number',
                    'mobile',
                    'mobilenumber',
                    'mobile number',
                    'number',
                    'telephone',
                    'tel',
                    'contact'
                ]);


            if (phone) {

                contacts.push({

                    name:
                        name ||
                        'there',

                    phone

                });

            }

        }
    );


    return deduplicateContacts(
        contacts
    );

}


function normalizeHeader(
    value
) {

    return String(
        value || ''
    )
        .toLowerCase()
        .replace(
            /[_-]+/g,
            ' '
        )
        .replace(
            /\s+/g,
            ' '
        )
        .trim();

}


function deduplicateContacts(
    contacts
) {

    const seen =
        new Set();


    const result =
        [];


    contacts.forEach(
        contact => {

            const normalized =
                normalizeGhanaPhone(
                    contact.phone
                );


            if (
                normalized &&
                !seen.has(
                    normalized
                )
            ) {

                seen.add(
                    normalized
                );


                result.push({

                    name:
                        contact.name,

                    phone:
                        normalized

                });

            }

        }
    );


    return result;

}


// =========================================================
// EXCEL PREVIEW
// =========================================================

function renderExcelPreview(
    contacts
) {

    const container =
        document.getElementById(
            'excelContactPreview'
        );


    if (!container) return;


    if (!contacts.length) {

        container.innerHTML = `
            <p>
                No valid contacts found.
            </p>
        `;

        return;

    }


    const preview =
        contacts.slice(
            0,
            50
        );


    let html = `

        <table>

            <thead>

                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Phone</th>
                </tr>

            </thead>

            <tbody>

    `;


    preview.forEach(
        (
            contact,
            index
        ) => {

            html += `

                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${escapeHtml(
                            contact.name
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            contact.phone
                        )}
                    </td>

                </tr>

            `;

        }
    );


    html += `
            </tbody>
        </table>

        <p
            style="
                padding:10px;
                font-size:0.72rem;
                color:var(--text-muted);
            "
        >
            ${contacts.length}
            valid contact(s) loaded.
            ${
                contacts.length > 50
                ? 'Showing first 50.'
                : ''
            }
        </p>
    `;


    container.innerHTML =
        html;

}


// =========================================================
// HUBTEL SMS SENDING
// =========================================================

async function handleHubtelSms(e) {

    e.preventDefault();


    const type =
        document.getElementById(
            'smsRecipientType'
        )?.value ||
        'all';


    const phone =
        document.getElementById(
            'smsSinglePhone'
        )?.value.trim() ||
        '';


    const singleName =
        document.getElementById(
            'smsSingleName'
        )?.value.trim() ||
        '';


    const message =
        document.getElementById(
            'smsMessage'
        )?.value.trim() ||
        '';


    if (!message) {

        alert(
            "Please enter an SMS message."
        );

        return;

    }


    if (
        type === 'single' &&
        !phone
    ) {

        alert(
            "Please enter the recipient's phone number."
        );

        return;

    }


    if (
        type === 'excel' &&
        !uploadedContacts.length
    ) {

        alert(
            "Please upload an Excel/CSV contact file first."
        );

        return;

    }


    const btn =
        e.target.querySelector(
            'button[type="submit"]'
        );


    if (btn) {

        btn.disabled =
            true;

        btn.dataset.originalText =
            btn.innerHTML;

        btn.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            Sending...
        `;

    }


    try {

        const payload = {

            action:
                'sendHubtelSms',

            type,

            phone,

            name:
                singleName,

            message

        };


        if (
            type === 'excel'
        ) {

            payload.contacts =
                uploadedContacts;

        }


        const result =
            await sendToBackend(
                payload
            );


        if (
            result &&
            result.status ===
            'success'
        ) {

            alert(
                `SMS dispatch completed.\n\nRecipients: ${result.dispatched}\nSuccessful: ${result.successful}\nFailed: ${result.failed}`
            );


            if (type === 'excel') {

                const file =
                    document.getElementById(
                        'smsExcelFile'
                    );

                if (file) {

                    file.value =
                        '';

                }


                uploadedContacts =
                    [];


                renderExcelPreview(
                    []
                );

            }


        } else {

            alert(
                result.message ||
                "SMS sending failed."
            );

        }


    } catch (err) {

        console.error(
            "SMS error:",
            err
        );


        alert(
            "Unable to send SMS. Please check your Hubtel settings and internet connection."
        );


    } finally {

        if (btn) {

            btn.disabled =
                false;

            btn.innerHTML =
                btn.dataset.originalText ||
                '<i class="fas fa-paper-plane"></i> Send SMS';

        }

    }

}


// =========================================================
// GHANA PHONE NORMALIZATION
// =========================================================

function normalizeGhanaPhone(
    phone
) {

    if (!phone) return '';


    let cleaned =
        String(phone)
            .replace(
                /[^\d+]/g,
                ''
            );


    if (
        cleaned.startsWith(
            '+233'
        )
    ) {

        cleaned =
            cleaned.substring(
                1
            );

    }


    if (
        cleaned.startsWith(
            '233'
        )
    ) {

        return cleaned;

    }


    if (
        cleaned.startsWith(
            '0'
        ) &&
        cleaned.length === 10
    ) {

        return (
            '233' +
            cleaned.substring(1)
        );

    }


    if (
        cleaned.length === 9
    ) {

        return (
            '233' +
            cleaned
        );

    }


    return '';

}


// =========================================================
// PERSONALIZATION
// =========================================================

function personalizeMessage(
    message,
    fullName
) {

    if (!message) return '';


    const safeName =
        String(
            fullName ||
            'there'
        ).trim();


    const firstName =
        safeName
            .split(/\s+/)[0] ||
            safeName;


    return String(
        message
    )
        .replace(
            /\{\{\s*name\s*\}\}/gi,
            safeName
        )
        .replace(
            /\{\s*name\s*\}/gi,
            safeName
        )
        .replace(
            /\{\{\s*firstName\s*\}\}/gi,
            firstName
        )
        .replace(
            /\{\s*firstName\s*\}/gi,
            firstName
        );

}


// =========================================================
// BACKEND
// =========================================================

async function sendToBackend(
    payload
) {

    try {

        const res =
            await fetch(
                SCRIPT_URL,
                {

                    method:
                        'POST',

                    headers: {

                        'Content-Type':
                            'text/plain'

                    },

                    body:
                        JSON.stringify(
                            payload
                        )

                }
            );


        return await res.json();


    } catch (err) {

        console.error(
            "Backend Error:",
            err
        );


        return {

            status:
                "error",

            message:
                err.toString()

        };

    }

}


// =========================================================
// HELPERS
// =========================================================

function escapeHtml(
    value
) {

    return String(
        value ?? ''
    )
        .replace(
            /&/g,
            '&amp;'
        )
        .replace(
            /</g,
            '&lt;'
        )
        .replace(
            />/g,
            '&gt;'
        )
        .replace(
            /"/g,
            '&quot;'
        )
        .replace(
            /'/g,
            '&#039;'
        );

}


function escapeAttribute(
    value
) {

    return escapeHtml(
        value
    );

}


function escapeJs(
    value
) {

    return String(
        value ?? ''
    )
        .replace(
            /\\/g,
            '\\\\'
        )
        .replace(
            /'/g,
            "\\'"
        )
        .replace(
            /\r?\n/g,
            '\\n'
        );

}