// Fichier JavaScript Demineur




var Gb_grid = [];
var Gb_grid_D=[];
var Gb_isbombe = false;
var Gb_row_size = 10;
var Gb_col_size = 10;
var Gb_maxBugs= 10;

function fn_createVirtualGrid() {

		//Recuperation de variables dans l'URL
		//Affectation des variables globales
		var parameters = location.search.substring(1).split("&");     
		var temp = parameters[0].split("=");     
		Gb_row_size = decodeURI(temp[1]);    
		temp = parameters[1].split("=");     
		Gb_col_size = decodeURI(temp[1]);
		temp = parameters[2].split("=");     
		Gb_maxBugs = decodeURI(temp[1]);

	for (let rowIndex= 0; rowIndex < Gb_row_size; rowIndex++){
		row=[];
		for (let colIndex= 0; colIndex < Gb_col_size; colIndex++){
			row.push(0);
		}
		Gb_grid.push(row);
	}
	for (let rowIndex_D= 0; rowIndex_D < Gb_row_size; rowIndex_D++){
		row=[];
		for (let colIndex_D= 0; colIndex_D < Gb_col_size; colIndex_D++){
			row.push(0);
		}
		Gb_grid_D.push(row);
	}
}

function fn_ajout_bombes(){
	lst_bombes=[];

	while(lst_bombes.length < Gb_maxBugs){
		coord = getRandomCoord();
		if(fn_recherche_tab(lst_bombes,coord)==false){
			lst_bombes.push(coord);
		}
	}
	for (coord of lst_bombes){
		Gb_grid[coord.row][coord.col]= "true";
		Gb_grid_D[coord.row][coord.col]= "true";
	}
	for (coord of lst_bombes){
		fn_numeros(coord.row,coord.col);
	}
}

function fn_recherche_tab(tab_src, val_but){
    for (let val_c of tab_src){
        if (val_c.row === val_but.row && val_c.col === val_but.col){
            return true;
        }
    }
    return false;
}

function fn_numeros(N_row,N_col){
	var incr = 1;
	const N_directions = [[-1, -1], [-1, 0], [-1, 1],[0, -1],[0, 1],[1, -1], [1, 0], [1, 1]];
	
			N_directions.forEach(([Nd_Row, Nd_Col]) => {	
				// on recupere les nouvelles coordonnees grace aux directions et de la case centrale clique
				newN_Row = N_row + Nd_Row;
				newN_Col = N_col + Nd_Col;
				incr = 1;

				// on verifie si les cases peripheriques sont en dehors du tableau ou non
				if(newN_Row<0) {
					newN_Row = 0 ;
					incr = 0;
				}
				if(newN_Row>Gb_row_size-1) {
					newN_Row = Gb_row_size-1;
					incr = 0;
				}
				
				if(newN_Col<0) {
					newN_Col = 0;
					incr = 0;
				}
				if(newN_Col>Gb_col_size-1) {	
					newN_Col = Gb_col_size-1;
					incr = 0;
				}

				// si non , on change la source des images peripherique a changer
				if(Gb_grid[newN_Row][newN_Col]	!== "true") {
					if (incr>0){
					Gb_grid[newN_Row][newN_Col]+=incr;
					}
				}

			});
}



function getRandomCoord(){
	const col = Math.floor(Math.random() * Gb_col_size);
	const row = Math.floor(Math.random() * Gb_row_size);
	return {col, row};
}

fn_createVirtualGrid(); 
fn_ajout_bombes();





window.addEventListener("load", function () {
	// on cree des lignes html en javascript pour creer le tableau html en reprenant la position des bombes depuis le tableau javascript
	let html = "";

	let V_y = 0;
	Gb_grid.forEach(ligne => {
		html += "<tr>";
		V_x = 0;
		ligne.forEach(cellule =>{
			if (cellule == "true"){
				Gb_isbombe=true;
			}
			else{
				// si il y a une bombe , on ajoute une image avec une bombe ici
				Gb_isbombe=false;
			}
			html +="<td><img class='tab_dem' src='./images/cache.png' alt='noir' id='"+V_x+"/"+V_y+"' data-x="+V_x+" data-y="+V_y+" data-B='"+Gb_isbombe+"' onclick='fn_revelio(this)' oncontextmenu='fn_clic_droit(this)'></td>";
		
			V_x++;
		});
		html +="</tr>";
		V_y++;
	});
    document.getElementById("table_pr").innerHTML = html;
});


let Gb_grid_drap = Array.from({length: Gb_grid_D.length}, () =>
   Array(Gb_grid_D[0].length).fill(false)
);
function fn_clic_droit(img_D) {
    const y = parseInt(img_D.dataset.y, 10);
    const x = parseInt(img_D.dataset.x, 10);
    if (Gb_grid_D[y][x] === "R") {
        return;
    }
    if (Gb_grid_drap[y][x] === false) {
        Gb_grid_drap[y][x] = true;
        img_D.src = "./images/drapeau.png"; 
    } else {
        Gb_grid_drap[y][x] = false; 
        img_D.src = "./images/cache.png"; 
    }
    
}




function fn_revelio(img) {
	clic_row = parseInt(img.dataset.y);
	clic_col = parseInt(img.dataset.x);

    // Verification de la source de l'image pour savoir si elle a ete devoile ou non
    if (img.src.endsWith("cache.png") && (Gb_grid_D[clic_row][clic_col]!=1)) {
        // Verifier si la donnee de la bombe est "fausse" et, si oui, Chiffre_0 l'image vide
        if (img.dataset.b == "false") {
            img.src = "./images/Chiffre_"+Gb_grid[clic_row][clic_col]+".png";
            img.alt = "Dv";
			Gb_grid_D[clic_row][clic_col]="R";
			if (img.src.endsWith("Chiffre_0.png")){
				//affichage des huits cases autour du clic
				fn_revelio_8c(clic_row,clic_col);
			}
			if (fn_test_victoire()==true){
				setTimeout(() => {
					//alerte pour informer le joueur de sa victoire
                    window.alert("Vous avez Gagne !");
                }, 500);
			}
        }
		else { // Si c'est une bombe, on affiche la bombe
            img.src = "./images/bombe.png";
            img.alt = "Bb";
            // La source de l'image est une bombe
            if (img.src = "./images/bombe.png") {
                setTimeout(() => {
                    window.alert("Vous avez perdu");
                }, 500); // On attend 500 ms et on envoie un message
                setTimeout(() => {
                    location.reload(); // Rafraichissement de la page HTML apres la perte
                }, 1500);

            }
        }
    }
}

function fn_revelio_8c(Start_row,Start_col,){

    const suite_img = [];
    suite_img.push({r: Start_row, c: Start_col});

    while(suite_img.length > 0) {
      	const {r, c} = suite_img.pop();
		const directions = [[-1, -1], [-1, 0], [-1, 1],[0, -1],[0, 1],[1, -1], [1, 0], [1, 1]];

		directions.forEach(([dRow, dCol]) => {	
			// on recupere les nouvelles coordonnees grace aux directions et de la case centrale clique
			newRow = r + dRow;
			newCol = c + dCol;

			// on verifie si les cases peripherique sont en dehors du tableau ou non
			if(newRow<0) {
				newRow = 0 ;
			}
			if(newRow>Gb_row_size-1) {
				newRow = Gb_row_size-1;
			}
			
			if(newCol<0) {
				newCol = 0;
			}
			if(newCol>Gb_col_size-1) {	
				newCol = Gb_col_size-1;
			}

			// si non , on change la source des images peripherique a changer
			if(Gb_grid[newRow][newCol]	!= "true"){
				if ((Gb_grid[newRow][newCol] == 0) && (Gb_grid_D[newRow][newCol]!="R")){
						suite_img.push({r: newRow, c: newCol});	
				}
				MyID = newCol+"/"+newRow
				NextIMG = document.getElementById(MyID);
				NextIMG.src = "./images/Chiffre_"+Gb_grid[newRow][newCol]+".png";
				Gb_grid_D[newRow][newCol]="R";
			} 	
		});
	}
}



function fn_test_victoire(){
V_Victoire = true

	let V_y = 0;
	Gb_grid_D.forEach(ligne => {
		V_x = 0;
		ligne.forEach(cellule =>{
			if (cellule == 0){
				V_Victoire = false;
			}
			V_x++;
		});
		V_y++;
	});

return V_Victoire

}

function fn_anim_acc(){

	document.getElementById("bouton_acc").src="./images/gif_bouton_acc.gif";
	setTimeout(() => {
		document.getElementById("bouton_acc").src="./images/Bouton_acc_apres_anim.png";
	}, 500);
}

function fn_revers_anim_acc(){
	
	document.getElementById("bouton_acc").src="./images/Reverse_anim_bouton_acc.gif";
	setTimeout(() => {
		document.getElementById("bouton_acc").src="./images/Bouton_acc_avant_anim.png";
	}, 500);


}

function fn_triche(){
	const Mdp_input = prompt("Veuillez entrer le mot de passe du debug :");
	const Mdp_triche = "Ordipass";
	if ((Mdp_input == Mdp_triche)){
		console.log("Tableau Gb_grid : ");
		console.table(Gb_grid);
		console.log("Tableau Gb_grid_D : ");
		console.table(Gb_grid_D);
		console.log("Tableau Gb_grid_drap : ");
		console.table(Gb_grid_drap);
		console.log("Tableau montrant les coordonnees des bombes : ");
		console.table(lst_bombes);
		document.getElementById("Bouton_triche").src="./images/coche_verte.png";
		window.alert("Mode debug active");
	}
	else{
		window.alert("Mot de passe incorrect");

	}
}