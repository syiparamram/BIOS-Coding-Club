/* ==========BIOS CODING CLUB SCRIPT.JS=========*/
const menus = document.querySelectorAll(".menu");
const workspace = document.querySelector(".workspace");
const itemPanel = document.querySelector(".item-panel");
const contentPanel = document.querySelector(".content-panel");
const helpPanel = document.querySelector(".help-content");
let activeMenu = 0;
let selectedMenu = 0;
let activeItem = 0;

let mode = "menu";

const statusItem=document.querySelector("#status-item");
const statusEnter=document.querySelector("#status-enter");
const statusEsc=document.querySelector("#status-esc");

/* ===================BOOT======================*/
boot();
function boot(){
	updateMenuHighlight();
    renderPage();
}

function updateMenuHighlight(){
    menus.forEach(menu=>menu.classList.remove("active"));
    menus[selectedMenu].classList.add("active");
}

function updateStatus(){
    if(mode==="menu"){
        statusItem.textContent="-----";
        statusEnter.textContent="Open";
        statusEsc.textContent="-----";
    }else{
        statusItem.textContent="Select Item";
        statusEnter.textContent="Select";
        statusEsc.textContent="Back";
    }
}

/* ================RENDER PAGE===================*/
function renderPage(){
    updateMenuHighlight();
	updateStatus();
    const menuKey = menus[activeMenu].dataset.menu;
    const page = biosData[menuKey];
    renderContent(page);
    renderHelp(page);
    renderItems(page);
}

/* ===================CONTENT=====================*/
function renderContent(page){
    if(page.showItems){
        const item = page.items[activeItem];
        contentPanel.innerHTML=`
        <h2>${item.title}</h2>
        <pre>${item.content}</pre>
        `;
        return;
    }

    contentPanel.innerHTML=`
    <h2>${page.title}</h2>
    <pre>${page.content}</pre>
    `;
}

/* ====================HELP======================*/
function renderHelp(page){
    if(page.showItems){
        helpPanel.innerHTML=
        page.items[activeItem].help;
        return;
    }

    helpPanel.innerHTML=page.help;
}

/* =================ITEM PANEL====================*/
function renderItems(page){
    if(!page.showItems){
        itemPanel.style.display="none";
        workspace.classList.add("full-content");
        return;
    }
	
    workspace.classList.remove("full-content");
    itemPanel.style.display="block";
    itemPanel.innerHTML="";
    page.items.forEach((item,index)=>{
       
	   itemPanel.innerHTML+=`
        <div class="item ${mode==="item" && index===activeItem?"active":""}">
            ${item.title}
        </div>
        `;
    });
}

document.addEventListener("keydown",(e)=>{
    if(e.key==="ArrowRight"){
		if(mode!=="menu") return;
        selectedMenu++;
        if(selectedMenu>=menus.length){
            selectedMenu=0;
        }

        updateMenuHighlight();
    }

    if(e.key==="ArrowLeft"){
		if(mode!=="menu") return;
        selectedMenu--;
        if(selectedMenu<0){
            selectedMenu=menus.length-1;
        }

        updateMenuHighlight();
    }
	
	if(e.key==="Enter"){
    activeMenu = selectedMenu;
	activeItem=0;
    const page = biosData[menus[activeMenu].dataset.menu]; 
    mode = page.showItems ? "item" : "menu";
    renderPage();
}

	if(e.key==="ArrowDown"){
	if(mode!=="item") return;
    const page = biosData[menus[activeMenu].dataset.menu];
    if(!page.showItems) return;
    activeItem++;
    if(activeItem>=page.items.length){
        activeItem=0;
    }
	
    renderPage();
}

if(e.key==="ArrowUp"){
	if(mode!=="item") return;
    const page = biosData[menus[activeMenu].dataset.menu];
    if(!page.showItems) return;
    activeItem--;
    if(activeItem<0){
        activeItem=page.items.length-1;
    }
	
    renderPage();
}

if(e.key==="Escape"){
    if(mode==="item"){
        mode="menu";
        renderPage();
    }
}
});