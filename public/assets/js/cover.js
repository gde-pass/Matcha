document.getElementById("clickmoi").addEventListener("click", clickOnCover);
function clickOnCover() {
    document.getElementById("clickmoi").hidden = true;
    document.getElementById("logmoi").hidden = false;
    eventFire(document.getElementById("initBT"), "click");
    document.body.style.cursor = "default";
}
