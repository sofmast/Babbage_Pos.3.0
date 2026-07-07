const deleteData = document.getElementById('futaBtn');
function abomination() {
    if (
        thisUser.access !== "Administrator" ||
        thisUser.firstName !== "System" 
    ) {
        showModal(
            `Sorry ${thisUser.firstName}`,
            "Something Went Wrong",
            "nop"
        );
       return;

  
    }

    showModal(
        `Succeeded`,
        "Application Data Erased",
        "error"
    );

    setTimeout(() => {
        localStorage.clear();
        window.location = "welcome.html";
    }, 2000);
}

deleteData.addEventListener('click',abomination);
