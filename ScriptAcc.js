// fichier javascript de l'accueil

function fn_transfert(bouton) {
    //exportation des deux variables via l'url
    var MyURL = "Demineur_jeu.html?Row="+bouton.dataset.row+"&Col="+bouton.dataset.col+"&Bbm="+bouton.dataset.bbm;
    //ouverture de la nouvelle fenetre
    window.open(MyURL, "_self");
    
}

function fn_easter_egg(img){
    document.getElementById("dem_easter_egg").src="./images/porte_easter_egg.png";
}