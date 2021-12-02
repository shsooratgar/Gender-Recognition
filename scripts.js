function showNotif(text, type) { // نوتیفیکیشن در زمان ارور
    let errorWrapper = document.getElementById(type);
    errorWrapper.style.width = '100%';
    errorWrapper.textContent = text;
    console.log('timeout staretd');
    setTimeout(() => {
        console.log('timeout finished');
        errorWrapper.style.width = '0';
        errorWrapper.textContent = ''
    }, 6000)
}

function resetNamePart() {// فیلد اسم را خالی می کند
    document.getElementById('name').innerHTML = '';
}

// دکمه سابمیت برای فرم و فرستادن اطلاعات
document.getElementById('submit-button').onclick = function (e) {
    let form = document.getElementById('form1');
    let gender_status = document.querySelector('#gender-status');
    let percentage = document.querySelector('#percentage');
    let status_saved = document.querySelector('#status-saved');

    var data = new FormData(form);
    var items = {};
    for (const entry of data) {
        items[entry[0]] = entry[1];
    }

    status_saved.innerText = localStorage.getItem(items['name']);

    if (check_input(items['name'])) {
        var xmlHttp;

        xmlHttp = new XMLHttpRequest();

        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.status > 400){
                console.log("Requset failed with Network error");
                showNotif('Requset failed with Network error', 'error');
                resetNamePart();
            }
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                var respData = JSON.parse(xmlHttp.responseText) || {};
                if (respData['gender']) {
                    gender_status.innerText = respData['gender'];
                    percentage.innerText = respData['probability'];
                } else {
                    console.log("not a good name")
                    document.querySelector('#alert').innerText = "چیزی پیدا نکرد"
                }
            }
        };

        xmlHttp.open(
            'GET',
            'https://api.genderize.io/?name=' +
            // taking care of multipart names
                items['name'].split(' ').join('%20'),
            true
        );

        xmlHttp.send(null);
    } else {
        document.querySelector('#alert').innerText = "اسم درست وارد کن"

    }

    e.preventDefault();
};

/*
    ذخیره جنسیت در لوکال استوریج

اگر کاربر یک دکمه جنسیت را انتخاب کند و سیو کند ، جنسیت سیو می شود.
اگر کاربر اسمی سابمیت کند وسیو کند جواب دریافتی به عنوان جنسیت ذخیره ی شود.

*/
document.getElementById('save-button').onclick = function (e) {
    var form = document.getElementById('form1');
    var status_saved = document.querySelector('#status-saved');
    var gender_status = document.querySelector('#gender-status');

    var data = new FormData(form);
    var items = {};
    for (const entry of data) {
        items[entry[0]] = entry[1];
    }
    if (check_input(items['name'])) {
        if (items['gender']) {
            localStorage.setItem(items['name'], items['gender']);
            status_saved.innerText = items['gender'];
        } else {
            var gender_requested = gender_status.innerText;
            status_saved.innerText = gender_requested;
            localStorage.setItem(items['name'], gender_requested);
            if (gender_requested.length == 0) {
                document.querySelector('#alert').innerText = "خب ؟چکار کنم الان"

            }
        }
    } else {
        console.log("not a good name")
        document.querySelector('#alert').innerText = "اسم درست وارد کن"
    }

    e.preventDefault();
};

function check_input(name) {
    var reg = /^[a-z A-Z]+$/;
    return reg.test(name);
}
/*
    چک می کند که ببیند اسم ذخیره شده تا آن را پاک کند. اگر اسمی ذخیره نشده بود ارور می دهد
*/
document.getElementById('clear-button').onclick = function (e) {
    var name = document.getElementById('name').value;
    var status_saved = document.querySelector('#status-saved');

    if (name.length != 0) {
        var gender = localStorage.getItem(name);
        if (gender) {
            localStorage.removeItem(name);
            status_saved.innerText = '';
            document.querySelector('#alert').innerText = 'با موفقیت پاک شد' + name ;
        } else {
            document.querySelector('#alert').innerText = "جنسیتی برای این اسم ذخیره نشده";
        }
    } else {
        document.querySelector('#alert').innerText = "چیو پاک کنم؟"
    }
    e.preventDefault();
};
