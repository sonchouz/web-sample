const themebtn = document.getElementById('themechanger');
const body = document.body;
function switchtheme()
{
    if(body.classList.contains('light-theme'))
    {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
    }
    else{
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
    }
}
themebtn.addEventListener('click', switchtheme);