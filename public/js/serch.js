let shops = [];
let $inputSearch = $('#find-shops');
let $listShops = $inputSearch
  .parent()
  .find('div.b-header-search-list');

const getShopsToSearch = (callback) => {
  $.ajax({
    type: 'GET',
    url: '/files/shops.json',
    success(data) { callback(data); },
  });
};

$(document).ready(() => {
  $inputSearch
    .focus(() => {
      if (!shops.length) {
        getShopsToSearch((res) => {
          shops = res;
        });
      }
    })
    .keyup(function () {
      const text = $(this).val();
      const newRegExp = new RegExp(text, 'i');
      const newRegExpTranslit = new RegExp(translit(text), 'i');
      const newRegExpenToRu = new RegExp(enToRu(text), 'i');
      const newRegExpruToEn = new RegExp(ruToEn(text), 'i');
      const newRegExptransliterror = new RegExp(transliterror(text), 'i');

      $listShops.empty();
      if (!text.length) {
        $listShops.css('display', 'none');
      } else $listShops.css('display', 'block');

      let isExist = false;
      let elements = '';
      for (let i = 0; i < shops.length; i += 1) {
        if (shops[i].name.match(newRegExp) || shops[i].name.match(newRegExpTranslit) || shops[i].name.match(newRegExpenToRu) || shops[i].name.match(newRegExpruToEn) || shops[i].name.match(newRegExptransliterror)) {
          isExist = true;
          elements += `<div class="b-header-search-list__item">
            <a href="/shops/${shops[i].url}">${shops[i].name}</a></div>`;
        }
      }

      if (!isExist) {
        elements += '<div class="b-header-search-list__item"><p>Ничего не найдено</p></div>';
      } $listShops.append(elements);
    });
  // транслиты
  function enToRu(text){
    let textLowerCase = text.toLowerCase();
    let transText = '';
    var transl = {
        'a': 'а',
        'b': 'б',
        'v': 'в', 
        'g': 'г',
        'd': 'д',
        'e': 'е',
        'e': 'ё',
        'zh': 'ж',
        'z': 'з',
        'i': 'и',
        'j': 'й',
        'k': 'к',
        'l': 'л',
        'm': 'м',
        'n': 'н',
        'o': 'о',
        'p': 'п',
        'r': 'р',
        's': 'с',
        't': 'т',
        'u': 'у',
        'f': 'ф',
        'h': 'х',
        'c': 'ц',
        'ch': 'ч',
        'sh': 'щ',
        'y': 'ы',
        'e': 'э',
        'yu':'ю',
        'ya': 'я'
    };
    for(i=0; i<textLowerCase.length; i++){
        if(transl[text[i]] != undefined){
            if (textLowerCase[i] == 'y' & textLowerCase[i+1] == 'u'){
                transText = transText  + 'ю';
                i=i+1;
            }
            else {
                if (textLowerCase[i] == 'y' & textLowerCase[i+1] == 'a') {
                    transText = transText  + 'я';
                    i=i+1;
                }
                else {
                    if (textLowerCase[i] == 'z' & textLowerCase[i+1] == 'h') {
                    transText = transText  + 'ж';
                    i=i+1;
                    }
                    else transText = transText  + transl[textLowerCase[i]];
                //

                }

                
            }
            
        }
        else {
            transText = transText  + textLowerCase[i];
        }

    }
    console.log('transText en-ru - '+transText);
    return transText;
}
function ruToEn(text) {
    let textLowerCase = text.toLowerCase();
    let transText = '';
    var transl = {
        'а': 'a',
        'б': 'b',
        'в': 'v',
        'г': 'g',
        'д': 'd',
        'е': 'e',
        'ё': 'jo',
        'ж': 'zh',
        'з': 'z',
        'и': 'i',
        'й': 'j',
        'к': 'k',
        'л': 'l',
        'м': 'm',
        'н': 'n',
        'о': 'o',
        'п': 'p',
        'р': 'r',
        'с': 's',
        'т': 't',
        'у': 'u',
        'ф': 'f',
        'х': 'h',
        'ц': 'c',
        'ч': 'ch',
        'ш': 'sh',
        'щ': 'shh',
        'ъ': '\'',
        'ы': 'y',
        'ь': '\'',
        'э': 'e',
        'ю': 'yu',
        'я': 'ya'
    };
    for(i=0; i<textLowerCase.length; i++){
        if(transl[text[i]] != undefined){
            transText = transText  + transl[textLowerCase[i]];
        }
        else {
            transText = transText  + textLowerCase[i];
        }

    }
    console.log('transText - '+transText);
    return transText;
}
function translit(text) {
    const textLowerCase = text.toLowerCase();
    let transText = '';
    const transl = {
        'q': 'й',
        'a': 'ф',
        'z': 'я',
        'w': 'ц',
        's': 'ы',
        'x': 'ч',
        'e': 'у',
        'd': 'в',
        'c': 'с',
        'r': 'к',
        'f': 'а',
        'v': 'м',
        't': 'е',
        'g': 'п',
        'b': 'и',
        'y': 'н',
        'h': 'р',
        'n': 'т',
        'u': 'г',
        'j': 'о',
        'm': 'ь',
        'i': 'ш',
        'k': 'л',
        ',': 'б',
        'o': 'щ',
        'l': 'д',
        '.': 'ю',
        'p': 'з',
        ';': 'ж',
        '[': 'х',
        '\'': 'э',
        '\]': 'ъ'
    };
    for(i=0; i<textLowerCase.length; i++){
        if(transl[text[i]] != undefined){
            transText = transText  + transl[textLowerCase[i]];
        }
        else {
            transText = transText  + textLowerCase[i];
        }
    }
    return transText;
};
function transliterror(text) {
    const textLowerCase = text.toLowerCase();
    let transText = '';
    const transl = {
        'й': 'q',
        'ф': 'a',
        'я': 'z',
        'ц': 'w',
        'ы': 's',
        'ч': 'x',
        'у': 'e',
        'в': 'd',
        'с': 'c',
        'к': 'r',
        'а': 'f',
        'м': 'v',
        'е': 't',
        'п': 'g',
        'и': 'b',
        'н': 'y',
        'р': 'h',
        'т': 'n',
        'г': 'u',
        'о': 'j',
        'ь': 'm',
        'ш': 'i',
        'л': 'k',
        'б': ',',
        'щ': 'o',
        'д': 'l',
        'ю': '.',
        'з': 'p',
        'ж': ';',
        'х': '[',
        'э': '\'',
        'ъ': '\]'
    };
    for(i=0; i<textLowerCase.length; i++){
        if(transl[text[i]] != undefined){
            transText = transText  + transl[textLowerCase[i]];
        }
        else {
            transText = transText  + textLowerCase[i];
        }

    }
    return transText;
};
  // конец транслитов  
});