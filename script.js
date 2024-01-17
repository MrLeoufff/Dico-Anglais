console.log("V1 : Mon dico anglais");

/*

MON PROGRAMME : 

> Je veux pouvoir donner la définition d'un mot à mes utilisateurs

- 1. Récupérer le mot saisi par l'utilisateur
- 2. Envoyer le mot à l'API ( https://dictionaryapi.dev/ )
- 3. Récupérer le JSON (la donnée) en lien avec mon mot
- 4. Afficher les informations de mon mot sur ma page (HTML)
- 5. Ajouter un lecteur pour écouter la prononciation du mot

*/

// Etape 1
const watchSubmit = () => {
  const form = document.querySelector("#form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const wordToSearch = data.get("search");
    reset();
    apiCall(wordToSearch);
  });
};
const reset = () => {
  const list = document.querySelector(".js-card-list")
  list.innerHTML = ""
  
}

// Etape 2
const apiCall = (word) => {
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((response) => response.json())
    .then((data) => {
      // Etape 3
    //   const wordInformation = data[0];
    const informationNeeded = extractData(data[0])
    renderToHtml(informationNeeded)
    })
    .catch((error) => {
      alert("Le mot demandé n'éxiste pas");
      console.error(error);
    });
};

const extractData = (data) => {
  // 1-Mot
  const word = data.word;
  // 2-Ecriture phonetique
  const phonetic = findProp(data.phonetics, "text");
  // 3-Prononciation
  let pronoum = findProp(data.phonetics, "audio");
  // 4-Définition(s)
  const meanings = data.meanings;
  return {
    word: word,
    phonetic: phonetic,
    pronoum: pronoum,
    meanings: meanings,
  }
};

const findProp = (array, name) => {
  // Elle parcours un tableau d'objet
  for (let i = 0; i < array.length; i++) {
    // Et cherche dans ce tableau si l'objet en cours contient une certaine propriete
    const currentObject = array[i];
    const hasProp = currentObject.hasOwnProperty(name);
    // Alors elle renvoie cette propriete
    if (hasProp) return currentObject[name];
  }
};
// Etape 4
const renderToHtml = (data) => {
    const card = document.querySelector('.js-card')
    card.classList.remove('card--hidden')
  // Manipulation de textes avec la propriété textContent
    const title = document.querySelector(".js-card-title")
    title.textContent = data.word
    const phonetic =document.querySelector(".js-card-phonetic")
    phonetic.textContent = data.phonetic
    // Création d'élément html
    let list = document.querySelector('.js-card-list')
    for (let i = 0; i < data.meanings.length; i++) {
      const meaning = data.meanings[i]
      const partOfSpeech = meaning.partOfSpeech
      const definition = meaning.definitions[0].definition
      // Création d'élément
      const li = document.createElement('li')
      li.classList.add('card-meaning')
      const pPartOfSpeech = document.createElement('p')
      pPartOfSpeech.textContent = partOfSpeech
      pPartOfSpeech.classList.add('card__part-of-speech')
      const pDefinition = document.createElement('p')
      pDefinition.textContent = definition
      pDefinition.classList.add('card__definition')

      li.appendChild(pPartOfSpeech)
      li.appendChild(pDefinition)
      list.appendChild(li)

      
    }
    // Ajout de l'audio en JS
    const button = document.querySelector('.js-card-button')
    audio = new Audio(data.pronoum)
    button.addEventListener('click', () => {
      button.classList.remove("card__player--off")
      button.classList.add("card__player--on")
      audio.play()
    })
    audio.addEventListener('ended', () => {
      button.classList.remove("card__player--on")
      button.classList.add("card__player--off")
    })
  
    
}

// Lancement du programme
watchSubmit();


