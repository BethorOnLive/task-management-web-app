/*---------------------------------Disparador de agregar nueva tarea------------------------------------------------------------------*/

//--Botón que dispara el evento que agrega una tarea nueva
const btnCln = document.querySelector(".add-task");
//--Contenedor ul
const ulContainer = document.querySelector(".content-task");
//--Esta variable va a determinar en que lugar se agregan o desagregan las nuevas tareas
let child = 0;
//--Se almacenan la referencia a los botones originales para luego ser clonados
const orgContentActions = document.querySelector(".content-actions");
const orgBtnRm = document.querySelector(".del-task");
const orgBtnEdit = document.querySelector(".edit-task");
//--Se almacena la referencia al elemento li 
const orgTask = document.querySelector(".li-tittle");

//--Método que agrega las nuevas tareas
btnCln.addEventListener('click', (event) =>{
    //--Evita que el input se resetee al hacer submit
    event.preventDefault();
    //--Referencia al fomulario
    const form = document.querySelector("form");
    //--Se recupera el valor ingresado en el input con el name="newTask"
    let newText = form.elements["newTask"].value;
    if(newText != ""){
        addTask(newText, false); //El segundo parametro es para indicar que es una nueva tarea por lo que aun no está en localStorage
    }else{
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "La tarea no puede estar vacia",
        });
    }
});

/*---------------------------------Función para agregar nueva tarea------------------------------------------------------------------*/

function addTask(newText, isRenderOfLS){
    //--Se clona el elemento li, se suma 1 a child, y se agrega como texto el valor recuperado del input
    const clnTask = orgTask.cloneNode(true);
    child++;
    console.log(newText);
    clnTask.textContent = newText;
    if(!isRenderOfLS){//Si es false significa que es una nueva tarea y debe cargarse a localStorage, de lo contraio debe saltar a la siguiente instruccion
        taskInLocalStorage(newText)
        console.log(isRenderOfLS);
    }
    document.getElementById("inputTask").value = ''; //resetea el valor del input
    //--Se crea las instancias de los clones de los botones
    const clnBtnRm = orgBtnRm.cloneNode(true);
    const clnBtnEdit = orgBtnEdit.cloneNode(true);
    const clnContentActions = orgContentActions.cloneNode(true);

    
    //--Hago un try para intentar inyectar los nodos clonados
    try {
        //--Se agrega un elemento li al final del contenedor padre ul
        ulContainer.append(clnTask);
        //--Despues de agregar un segundo elemeto li, liElement almacena una referencia de ese segundo li para posteriormente poder inyectar los botones clonados dentro
        let liElement = ulContainer.children[child];
        //--Se almacenan los botones dentro del ultimo elemento li
        liElement.append(clnContentActions);

    } catch (error) {
         //--Si ocurre una excepción, se ejecuta este bloque
        console.log("Ocurrió un error:", error.message);
    }
}

/*---------------------------------Botones disparadores para editar y eliminar---------------------------------------------------------*/

//--Este método edita o elimina dependiendo de la clase que tenga el botón
ulContainer.addEventListener('click', (event) =>{
    //--Se usa el event.target para identificar la clase del botón que se ha accionado
    if(event.target.classList.contains("del-task")){
        console.log("remove");
        const arrayLi = document.querySelectorAll("li");

        /***Con esta linea podemos saber el indice del elemento li donde se va a hacer la eliminación***/
        const index = Array.from(arrayLi).indexOf(event.target.closest("li"));
        console.log(`Has clickeado el elemento con índice: ${index}`);
        
        const parentElement = event.target.parentElement;
        
        //--La condición no permite eliminar la primer tarea que es la que está seteada por defecto
        if(child == 0){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "No puedes eliminar la tarea de ejemplo",
              });
        }
        if (child > 0) {
            Swal.fire({
                title: "¿Estás seguro que quieres eliminar la tarea?",
                icon: "warning",
                showCancelButton: true,
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, eliminar!"
              }).then((result) => {
                if (result.isConfirmed) {
                parentElement.remove(); // Elimina el <li> más cercano
                removeLocalSg(index);
                  Swal.fire({
                    title: "Eliminada!",
                    text: "La tarea ha sido eliminada.",
                    icon: "success"
                  });
                  child--;
                }
            });
        }
    }else if(event.target.classList.contains("edit-task")){
        const arrayLi = document.querySelectorAll("li");
        const closestLi = event.target.closest("li");
        /***Con esta linea podemos saber el indice del elemento li donde se va a hacer la edicion***/
        const index = Array.from(arrayLi).indexOf(event.target.closest("li"));
        console.log(`Has clickeado el elemento con índice: ${index}`);
        
        Swal.fire({
            title: "Modifica la tarea",
            input: "text",
            inputValue: closestLi.firstChild.textContent,
            inputPlaceholder: "Escribe aqui",
            confirmButtonText: "Save",
            showCancelButton: true,
        }).then((result) => {
            const inputValue = result.value;
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              Swal.fire("Guardado!", "", "success");
              console.log(inputValue);
              editLocalSg(index,inputValue);
              closestLi.firstChild.textContent = inputValue;
            } else if (result.isDenied) {
              Swal.fire("Cambios no guardados", "", "info");
            }
        });
    }    
});

/*---------------------------------Funcíón agrega información al localStorage------------------------------------------------------------*/

function taskInLocalStorage(task){
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");    
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


/*---------------------------------Funcíón que toma la información del localStorage para renderizarla en el navegador------------------*/

function renderLocalSg(){
    const elements = JSON.parse(localStorage.getItem("tasks"));
    console.log(elements);
    const numOfElements = elements.length;
    console.log(numOfElements);
    elements.forEach(item => {
        console.log(item);
        addTask(item, true);//El segundo parametro es para indicar que no es una nueva tarea, ya se encuentra en localStorage y solo se va a renderizar
    });
}
renderLocalSg();

/*---------------------------------Funcíón para eliminar un registro ondemand del localStorage------------------*/

function removeLocalSg(element){
    console.log("removeLocalSg");
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    tasks.splice((element-1),1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    const elements = JSON.parse(localStorage.getItem("tasks"));
    console.log(elements);
}

/*---------------------------------Funcíón para editar un registro ondemand del localStorage------------------*/

function editLocalSg(element, newValue){
    console.log("editLocalSg");
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    tasks.splice((element-1),1,newValue);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    const elements = JSON.parse(localStorage.getItem("tasks"));
    console.log(elements);
}

const themeToggleButton = document.getElementById("btn-theme");
let currentTheme = localStorage.getItem("theme"); //se crea una instancia en localStorage y se le asigna un id
console.log("currentTheme " + currentTheme);

/*----------------------------------------------------Dark mode--------------------------------------------------------------*/

themeToggleButton.addEventListener('click', () =>{
    
    const body = document.querySelector("body");
    const card = document.querySelector("div");
    const arrayLi = document.querySelectorAll("li");

    themeToggleButton.classList.toggle("dark");
    body.classList.toggle("dark-body");
    card.classList.toggle("dark-card");
    arrayLi.forEach(item => {
        console.log(item);
        item.classList.toggle("dark-li");
    });
    const theme = themeToggleButton.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme",theme);
    console.log("theme " + theme);
});

if(currentTheme === "dark"){
    console.log("condicion entra");
    themeToggleButton.classList.add("dark");
    document.querySelector("body").classList.add("dark-body");
    document.querySelector("div").classList.toggle("dark-card");
    document.querySelectorAll("li").forEach(item => {
        console.log(item);
        item.classList.add("dark-li");
    });
}