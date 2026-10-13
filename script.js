// Initialize logs array from localStorage or create an empty array
let logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];

// DOM Elements
const liveClock = document.getElementById('liveClock');
const liveDate = document.getElementById('liveDate');
const empIdInput = document.getElementById('empId');
const empNameInput = document.getElementById('empName');
const btnTimeIn = document.getElementById('btnTimeIn');
const btnTimeOut = document.getElementById('btnTimeOut');
const statusMessage = document.getElementById('statusMessage');
const logBody = document.getElementById('logBody');
const btnExport = document.getElementById('btnExport');
const btnClear = document.getElementById('btnClear');

// Update Live Clock
function updateClock() {
    const now = new Date();
    liveClock.textContent = now.toLocaleTimeString('en-US', { hour12: true });
    liveDate.textContent = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
setInterval(updateClock, 1000);
updateClock(); // Initial call

// Show temporary status message
function showMessage(text, isError = false) {
    statusMessage.textContent = text;
    statusMessage.className = `status-message ${isError ? 'msg-error' : 'msg-success'}`;
    setTimeout(() => {
        statusMessage.textContent = '';
    }, 3000);
}

// Render Table
function renderTable() {
    logBody.innerHTML = '';
    // Reverse logs to show newest at the top
    const displayLogs = [...logs].reverse();
    
    displayLogs.forEach(log => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${log.date}</td>
            <td>${log.time}</td>
            <td>${log.id}</td>
            <td>${log.name}</td>
            <td class="${log.type === 'Time In' ? 'type-in' : 'type-out'}">${log.type}</td>
        `;
        logBody.appendChild(row);
    });
}

// Add Log Entry
function addLog(type) {
    const id = empIdInput.value.trim();
    const name = empNameInput.value.trim();

    if (!id || !name) {
        showMessage('Please enter both Employee ID and Name.', true);
        return;
    }

    const now = new Date();
    const newLog = {
        date: now.toLocaleDateString('en-US'),
        time: now.toLocaleTimeString('en-US', { hour12: true }),
        id: id,
        name: name,
        type: type
    };

    logs.push(newLog);
    localStorage.setItem('attendanceLogs', JSON.stringify(logs));
    renderTable();
    
    // Clear inputs and show success
    empIdInput.value = '';
    empNameInput.value = '';
    showMessage(`Successfully recorded ${type} for ${name}`);
}

// Export logs to .txt file
function exportToTxt() {
    if (logs.length === 0) {
        showMessage('No logs to export.', true);
        return;
    }

    let fileContent = "INTERNATIONAL SCHOOL - ATTENDANCE LOG\n";
    fileContent += "=====================================\n\n";
    fileContent += "Date\t\tTime\t\tID\t\tName\t\tType\n";
    fileContent += "-----------------------------------------------------------------------\n";

    logs.forEach(log => {
        fileContent += `${log.date}\t${log.time}\t${log.id}\t${log.name}\t${log.type}\n`;
    });

    // Create a Blob containing the text data
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element to trigger the download
    const a = document.createElement('a');
    const fileNameDate = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `Attendance_Log_${fileNameDate}.txt`;
    
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Clear Logs
function clearLogs() {
    if (confirm("Are you sure you want to clear all logs? This cannot be undone.")) {
        logs = [];
        localStorage.removeItem('attendanceLogs');
        renderTable();
        showMessage('Logs cleared successfully.');
    }
}

// Event Listeners
btnTimeIn.addEventListener('click', () => addLog('Time In'));
btnTimeOut.addEventListener('click', () => addLog('Time Out'));
btnExport.addEventListener('click', exportToTxt);
btnClear.addEventListener('click', clearLogs);

// Initial render
renderTable();

//connecting to Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCOmKOgqb13rNOfz1rigWyYXiGwBnc0hkk",
  authDomain: "attendance-18061.firebaseapp.com",
  projectId: "attendance-18061",
  storageBucket: "attendance-18061.firebasestorage.app",
  messagingSenderId: "613105098491",
  appId: "1:613105098491:web:12074ed2f876c380ea1a5e",
  measurementId: "G-0PT75GJFZM"
};