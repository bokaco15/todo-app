let ToDo = function(rootElementAll, rootElementActive, rootElementCompleted) {
    // Konstruktorska funkcija za ToDo aplikaciju koja prima tri DOM elementa kao argumente.
    // rootElementAll - element u kojem će se prikazivati sve stavke.
    // rootElementActive - element u kojem će se prikazivati aktivne (nezavršene) stavke.
    // rootElementCompleted - element u kojem će se prikazivati završene stavke.

    this.rootElementAll = rootElementAll; // Čuva referencu na DOM element za prikaz svih stavki.
    this.rootElementActive = rootElementActive; // Čuva referencu na DOM element za prikaz aktivnih stavki.
    this.rootElementCompleted = rootElementCompleted; // Čuva referencu na DOM element za prikaz završenih stavki.

    // Konstruktorska funkcija koja kreira pojedinačne ToDo stavke.
    let ToDoItem = function(content, date) {
        this.id = Math.random().toString(36).substring(7); // Generiše jedinstveni ID koristeći nasumične karaktere.
        this.content = content; // Čuva sadržaj stavke, odnosno opis zadatka.
        this.date = date; // Čuva datum kreiranja stavke ili rok završetka.
        this.completed = false; // Po default-u stavka nije završena kada se kreira.
    };

    // ViewModel klasa koja povezuje podatke stavke i njen vizualni prikaz.
    let ToItemViewModel = function(toDoItem, views) {
        this.data = toDoItem; // Čuva podatke o ToDo stavci (sadržaj, datum, status završenosti).
        this.views = views; // Čuva HTML prikaze stavke u različitim listama (sve, aktivne, završene).
    };

    let toDoItems = []; // Prazan niz koji će čuvati sve ToDo stavke kao ViewModel objekte.

    // HTML šablon koji opisuje strukturu jedne ToDo stavke u korisničkom interfejsu.
    const TODO_ITEM_TEMPLATE = `
        <div class="todo-item-date">
            <span class="day"></span> <!-- Prikazuje dan kada je stavka kreirana ili rok završetka -->
            <span class="month"></span> <!-- Prikazuje mesec kada je stavka kreirana ili rok završetka -->
        </div>
        <div class="todo-item-content">
            <span class="data"></span> <!-- Prikazuje tekstualni sadržaj zadatka -->
        </div>
        <span class="delete-btn" title="delete"></span> <!-- Dugme za brisanje stavke -->
    `;

    // Funkcija koja generiše vizualni prikaz jedne ToDo stavke na osnovu njenih podataka.
    function generateToDoItemView(toDoItem) {
        let toDoItemRoot = document.createElement("div"); // Kreira novi div element za ToDo stavku.
        toDoItemRoot.classList.add("todo-item"); // Dodaje CSS klasu za stilizaciju stavke.
        toDoItemRoot.setAttribute("data-id", toDoItem.id); // Postavlja jedinstveni ID za identifikaciju stavke.

        toDoItemRoot.innerHTML = TODO_ITEM_TEMPLATE; // Ubacuje HTML šablon za strukturu stavke.
        toDoItemRoot.querySelector(".day").innerHTML = toDoItem.date.toLocaleString("default", { day: "numeric" }); // Prikazuje dan kreiranja.
        toDoItemRoot.querySelector(".month").innerHTML = toDoItem.date.toLocaleString("default", { month: "short" }); // Prikazuje mesec kreiranja.
        toDoItemRoot.querySelector(".data").innerHTML = toDoItem.content; // Postavlja tekstualni sadržaj stavke.

        toDoItemRoot.querySelector(".delete-btn").setAttribute("data-id", toDoItem.id); // Postavlja ID na dugme za brisanje.

        if (toDoItem.completed) {
            toDoItemRoot.classList.add("completed"); // Ako je stavka završena, dodaje CSS klasu "completed".
        }

        let toDoItemRootCopy = toDoItemRoot.cloneNode(true); // Kreira kopiju HTML prikaza za drugu listu (aktivni/završeni).

        rootElementAll.append(toDoItemRoot); // Dodaje originalni prikaz stavke u listu svih zadataka.

        if (toDoItem.completed) {
            rootElementCompleted.append(toDoItemRootCopy); // Ako je završena, stavlja je u listu završenih.
        } else {
            rootElementActive.append(toDoItemRootCopy); // Ako nije završena, stavlja je u listu aktivnih.
        }

        let toDoItemViewModel = new ToItemViewModel(toDoItem, [toDoItemRoot, toDoItemRootCopy]); 
        // Kreira novi ViewModel koji povezuje podatke o stavci i njen vizualni prikaz.

        toDoItems.push(toDoItemViewModel); // Dodaje ViewModel u globalni niz stavki.

        registerDeleteHandlers(toDoItemViewModel); // Povezuje dugme za brisanje sa funkcijom brisanja.
        registerClickHandlers(toDoItemViewModel); // Povezuje klik na stavku sa promenom statusa (završena/nezavršena).

        // Funkcija koja registruje funkcionalnost za brisanje stavki.
        function registerDeleteHandlers(toDoItemViewModel) {
            for (let i = 0; i < toDoItemViewModel.views.length; i++) {
                // Iterira kroz oba prikaza stavke (jedan u listi "sve", drugi u listi "aktivni" ili "završeni").
                toDoItemViewModel.views[i].querySelector(".delete-btn").onclick = function(e) {
                    e.stopPropagation(); // Sprečava izvršenje drugih događaja prilikom brisanja.
                    let id = this.dataset.id; // Uzima ID stavke koja treba biti obrisana.
                    let index = toDoItems.findIndex(item => item.data.id === id); // Pronalazi stavku u nizu prema ID-ju.

                    if (index > -1) { // Ako je stavka pronađena...
                        toDoItems.splice(index, 1); // Briše stavku iz niza.
                        toDoItemViewModel.views[0].parentNode.removeChild(toDoItemViewModel.views[0]); // Uklanja prikaz iz liste "sve".
                        toDoItemViewModel.views[1].parentNode.removeChild(toDoItemViewModel.views[1]); // Uklanja prikaz iz liste "aktivni" ili "završeni".
                    }

                    saveToLocalStorage(); // Čuva ažurirani niz u localStorage.
                };
            }
        }

        // Funkcija koja registruje klik funkcionalnost za promenu statusa (završena/nezavršena).
        function registerClickHandlers(toDoItemViewModel) {
            for (let i = 0; i < toDoItemViewModel.views.length; i++) {
                toDoItemViewModel.views[i].onclick = function() {
                    let id = this.dataset.id; // Uzima ID stavke koja je kliknuta.
                    let index = toDoItems.findIndex(item => item.data.id === id); // Pronalazi stavku prema ID-ju.
                    toDoItemViewModel.data.completed = !toDoItemViewModel.data.completed; // Menja status stavke (završena/nezavršena).

                    if (toDoItemViewModel.data.completed) {
                        toDoItemViewModel.views[0].classList.add("completed"); // Ako je završena, dodaje CSS klasu "completed".
                        toDoItemViewModel.views[1].classList.add("completed"); // Dodaje klasu u oba prikaza.
                        rootElementCompleted.appendChild(toDoItemViewModel.views[1]); // Premesta stavku u listu završenih.
                    } else {
                        toDoItemViewModel.views[0].classList.remove("completed"); // Ako nije završena, uklanja klasu "completed".
                        toDoItemViewModel.views[1].classList.remove("completed");
                        rootElementActive.appendChild(toDoItemViewModel.views[1]); // Premesta stavku nazad u listu aktivnih.
                    }

                    saveToLocalStorage(); // Čuva ažuriranu stavku u localStorage.
                };
            }
        }

        // Funkcija koja čuva trenutne stavke u localStorage.
        function saveToLocalStorage() {
            localStorage.setItem("todo-data", JSON.stringify(toDoItems.map(item => item.data))); 
            // Serijalizuje niz ToDo stavki i čuva ga u localStorage.
        }

        // Funkcija koja učitava stavke iz localStorage prilikom pokretanja aplikacije.
        function loadFromLocalStorage() {
            var json = localStorage.getItem("todo-data"); // Učitava podatke iz localStorage.
            if (json === null) return; // Ako nema podataka, prekida funkciju.

            let storedItems = JSON.parse(json, (key, value) => {
                if (key === "date") value = new Date(value); // Parsira datume u Date objekte.
                return value;
            });

            if (storedItems.length === 0) return; // Ako nema stavki, prekida funkciju.

            for (let i = 0; i < storedItems.length; i++) {
                generateToDoItemView(storedItems[i]); // Generiše vizualni prikaz za svaku stavku iz localStorage.
            }
        }

        loadFromLocalStorage(); // Poziva funkciju za učitavanje stavki iz localStorage prilikom pokretanja.
    }

    return {
        // Funkcija za dodavanje nove stavke u ToDo listu.
        add: function(content) {
            let toDoItem = new ToDoItem(content, new Date()); // Kreira novu ToDo stavku sa trenutnim datumom.
            generateToDoItemView(toDoItem); // Generiše vizualni prikaz nove stavke.
            saveToLocalStorage(); // Čuva novu stavku u localStorage.
        }
    };
};
