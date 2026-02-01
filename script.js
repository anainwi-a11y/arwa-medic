

let timers = {}; 
let language = 'ar';

// النصوص حسب اللغة
const texts = {
  ar: {
    scale: "الميزان ⚖️",
    auto1: "الأوطوكلاف 1 🔥",
    auto2: "الأوطوكلاف 2 🔥",
    reports: "التقارير",
    dev: "مطور التطبيق",
    company: "عن الشركة",
    alarmTitle: "تحذير 🚨",
    scaleMsg: "لا تنسى تقرير الميزان",
    auto1Msg: "لا تنسى تقرير الأوطوكلاف 1",
    auto2Msg: "لا تنسى تقرير الأوطوكلاف 2",
    companyInfo: `<img src="https://media.licdn.com/dms/image/v2/C4D0BAQGaeAYON-oOvA/company-logo_200_200/company-logo_200_200/0/1630527974765/arwamedic_logo?e=2147483647&v=beta&t=evPFBkTyamZjOc-OjU6RiV9KUUs7lMsqdSvScvssp-c" alt="ARWA MEDIC"><br>
    ARWA MEDIC est une société pharmaceutique marocaine créée en mars 2017. En attendant la finalisation prochaine de son unité pharmaceutique à Marrakech, ARWA MEDIC a d'ores et déjà signé un premier accord de distribution de Dispositifs médicaux pour Dialyse (filtres, Lignes de Sang et aiguilles à fistules) avec une société européenne. L’exploitation de cette gamme a démarré en Octobre 2018.<br>
    <a href="http://www.arwamedic.com" target="_blank">الموقع الإلكتروني</a><br>
    المجال المهني: تصنيع المستحضرات الصيدلانية<br>
    حجم الشركة: ٥١ - ٢٠٠ من الموظفين<br>
    المقر الرئيسي: Marrakech, Marrakech Safi<br>
    النوع: شركة يملكها عدد قليل من الأشخاص<br>
    التأسيس: 2017`
  },
  fr: {
    scale: "Balance ⚖️",
    auto1: "Autoclave 1 🔥",
    auto2: "Autoclave 2 🔥",
    reports: "Rapports",
    dev: "Développeur de l'application",
    company: "À propos de l'entreprise",
    alarmTitle: "Alerte 🚨",
    scaleMsg: "N'oubliez pas le rapport Balance",
    auto1Msg: "N'oubliez pas le rapport Autoclave 1",
    auto2Msg: "N'oubliez pas le rapport Autoclave 2",
    companyInfo: "ARWA MEDIC est une société pharmaceutique marocaine créée en mars 2017. En attendant la finalisation prochaine de son unité pharmaceutique à Marrakech, ARWA MEDIC a signé un accord de distribution de dispositifs médicaux pour la dialyse."
  },
  en: {
    scale: "Scale ⚖️",
    auto1: "Autoclave 1 🔥",
    auto2: "Autoclave 2 🔥",
    reports: "Reports",
    dev: "App Developer",
    company: "About Company",
    alarmTitle: "Warning 🚨",
    scaleMsg: "Don't forget the Scale report",
    auto1Msg: "Don't forget the Autoclave 1 report",
    auto2Msg: "Don't forget the Autoclave 2 report",
    companyInfo: "ARWA MEDIC is a Moroccan pharmaceutical company founded in March 2017. While its production unit in Marrakech is under construction, ARWA MEDIC signed a distribution agreement for dialysis medical devices."
  }
};

// تغيير اللغة
function setLang(lang) {
  language = lang;
  document.getElementById('scaleLabel').innerText = texts[lang].scale;
  document.getElementById('auto1Label').innerText = texts[lang].auto1;
  document.getElementById('auto2Label').innerText = texts[lang].auto2;
  document.getElementById('btnReportsLabel').innerText = texts[lang].reports;
  document.getElementById('btnDevLabel').innerText = texts[lang].dev;
  document.getElementById('btnCompanyLabel').innerText = texts[lang].company;
  document.getElementById('reportsTitle').innerText = texts[lang].reports;
}

// التنقل بين الصفحات
function openReports() {
  document.getElementById('homePage').style.display = 'none';
  document.getElementById('reportsPage').style.display = 'block';
}
function goHome() {
  document.getElementById('homePage').style.display = 'flex';
  document.getElementById('reportsPage').style.display = 'none';
}

// نافذة المنبه
function openModal(title, message) {
  document.getElementById('alarmTitle').innerText = title;
  document.getElementById('alarmMessage').innerHTML = message;
  document.getElementById('alarmModal').style.display = 'flex';
}
function closeModal() {
  document.getElementById('alarmModal').style.display = 'none';
}

// المنبهات (صوت + اهتزاز)
function startAlarm(task) {
  stopAlarm(task);
  let countdownEl = document.getElementById(task+'_countdown');
  let startTimeInput = document.getElementById(task+'_start')?.value;
  let intervalMinutes = 15;
  if(task==='scale'){
    intervalMinutes = parseInt(document.getElementById('scale_interval').value);
  }
  let now = new Date();
  let startTime = startTimeInput ? new Date(`${now.toDateString()} ${startTimeInput}`) : now;
  let endTime = new Date(startTime.getTime() + intervalMinutes*60000);
  let totalSeconds = Math.floor((endTime - now)/1000);
  if(totalSeconds <= 0) totalSeconds = intervalMinutes*60;

  const timer = setInterval(()=>{
    if(totalSeconds <=0){
      clearInterval(timer);
      let msg = texts[language][task+'Msg'];
      openModal(texts[language].alarmTitle, msg);

      if(navigator.vibrate){
        navigator.vibrate([1000, 500, 1000]);
      }
      const audio = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg'); 
      audio.play();

      startAlarm(task);
      return;
    }
    let h = Math.floor(totalSeconds/3600);
    let m = Math.floor((totalSeconds%3600)/60);
    let s = totalSeconds%60;
    countdownEl.innerText = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    totalSeconds--;
  },1000);
  timers[task] = timer;
}

function stopAlarm(task){
  if(timers[task]){
    clearInterval(timers[task]);
    delete timers[task];
  }
}
function deleteAlarm(task){
  stopAlarm(task);
  document.getElementById(task+'_countdown').innerText="--:--:--";
}

// معلومات الشركة والمطور مع تغيير اللغة
function openCompany(){
  openModal(texts[language].company, texts[language].companyInfo);
}
function openDev(){
  openModal(texts[language].dev, 'صفحة الفيسبوك: <a href="https://www.facebook.com/share/18NqsirKCC/" target="_blank">Youssef Hadi</a>');
}