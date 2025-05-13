document.addEventListener('DOMContentLoaded', () => {
    openTab('home');
});

function openTab(tabId) {
    const existingTab = document.getElementById(`tab-${tabId}`);
    if (!existingTab) {
        const tabBar = document.getElementById('tab-bar');
        const newTab = document.createElement('span');
        newTab.classList.add('tab');
        newTab.id = `tab-${tabId}`;
        newTab.innerHTML = `${capitalize(tabId)} <button onclick="closeTab('${tabId}')">x</button>`;
        newTab.onclick = () => switchTab(tabId);
        tabBar.appendChild(newTab);
    }
    switchTab(tabId);
}

function switchTab(tabId) {
    const sections = document.querySelectorAll('.tab-content');
    sections.forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(tabId).classList.remove('hidden');
    
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`tab-${tabId}`).classList.add('active');
}

function closeTab(tabId) {
    const tab = document.getElementById(`tab-${tabId}`);
    if (tab) {
        tab.remove();
    }

    const content = document.getElementById(tabId);
    if (content) {
        content.classList.add('hidden');
    }

    const visibleTabs = document.querySelectorAll('.tab');
    if (visibleTabs.length === 0) {
        openTab('home');
    } else {
        const lastOpenedTab = visibleTabs[visibleTabs.length - 1].id.replace('tab-', '');
        switchTab(lastOpenedTab);
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
