let headerButtons = document.querySelectorAll(".header-cell") 
// Selektuje sve elemente sa klasom "header-cell" i smešta ih u promenljivu headerButtons.

let allItems = document.querySelector("#all-items") 
// Selektuje element sa ID-jem "all-items" i smešta ga u promenljivu allItems.

window.addEventListener("load", function() { 
    // Postavlja event listener za "load" događaj prozora, koji se aktivira kada se svi resursi stranice učitaju.
    
    for(let headerButton of headerButtons) { 
        // Prolazi kroz svaki element iz headerButtons.
        
        headerButton.onclick = function() { 
            // Postavlja onclick funkciju za svaki headerButton.
            openTab(parseInt(this.id.substring(this.id.length - 1))) 
            // Poziva openTab funkciju sa brojem koji se nalazi na kraju ID-a headerButton-a.
        }
    }

    let contentInput = document.querySelector("#content") 
    // Selektuje element za unos sadržaja i smešta ga u promenljivu contentInput.

    let addButton = document.querySelector("#add-btn") 
    // Selektuje dugme za dodavanje i smešta ga u promenljivu addButton.

    examineHash() 
    // Poziva funkciju examineHash za proveru trenutnog hash-a u URL-u.

    let allItemsContainer = document.querySelector("#all-items-container") 
    // Selektuje kontejner za sve stavke i smešta ga u promenljivu allItemsContainer.

    let activeItemsContainer = document.querySelector("#active-items-container") 
    // Selektuje kontejner za aktivne stavke i smešta ga u promenljivu activeItemsContainer.

    let completedItemsContainer = document.querySelector("#completed-items-container") 
    // Selektuje kontejner za završene stavke i smešta ga u promenljivu completedItemsContainer.

    let toDoApp = new ToDo(allItemsContainer, activeItemsContainer, completedItemsContainer) 
    // Kreira novu instancu ToDo aplikacije prosleđujući kontejner za sve, aktivne i završene stavke.

    addButton.onclick = function() { 
        // Postavlja onclick funkciju za dugme za dodavanje.
        
        if(contentInput.value !== '') { 
            // Proverava da li je unos sadržaja prazan.
            
            toDoApp.add(contentInput.value) 
            // Poziva add metodu na toDoApp instanci sa unetim sadržajem.
            
            contentInput.value = "" 
            // Briše sadržaj iz input polja nakon dodavanja.
        }
    }
})

window.addEventListener("hashchange", function(e) { 
    // Postavlja event listener za "hashchange" događaj koji se aktivira kada se hash deo URL-a promeni.
    
    examineHash() 
    // Poziva examineHash funkciju da proveri novi hash.
})

function examineHash() { 
    // Funkcija za rutiranje na osnovu hash vrednosti u URL-u.
    
    switch(window.location.hash) { 
        // Proverava hash vrednost u URL-u.
        
        case "#all-items":
        case "":
            openTab(1) 
            // Ako je hash "#all-items" ili prazan, otvara prvi tab.
            break
        
        case "#pending-items":       
            openTab(2) 
            // Ako je hash "#pending-items", otvara drugi tab.
            break

        case "#active-items":
            openTab(3) 
            // Ako je hash "#active-items", otvara treći tab.
            break    
    }
}

function openTab(no) { 
    // Funkcija za otvaranje tabova.

    for(let headerButton of headerButtons) { 
        // Prolazi kroz sve headerButtons.
        
        headerButton.classList.add("inactive-header-cell") 
        // Dodaje klasu "inactive-header-cell" za stilizaciju inaktivnih tabova.
    }

    document.querySelector("#tab-" + no).classList.remove("inactive-header-cell") 
    // Uklanja klasu "inactive-header-cell" sa aktivnog taba.

    switch(no) { 
        case 1: 
            allItems.style.marginLeft = "0%" 
            // Postavlja marginu levu na 0% za prikaz svih stavki.
            window.location.hash = "#all-items" 
            // Ažurira hash u URL-u na "#all-items".
            break
            
        case 2: 
            allItems.style.marginLeft = "-100%" 
            // Postavlja marginu levu na -100% za prikaz čekajućih stavki.
            window.location.hash = "#pending-items" 
            // Ažurira hash u URL-u na "#pending-items".            
            break
            
        case 3: 
            allItems.style.marginLeft = "-200%" 
            // Postavlja marginu levu na -200% za prikaz aktivnih stavki.
            window.location.hash = "#active-items" 
            // Ažurira hash u URL-u na "#active-items".            
            break
    }
}
