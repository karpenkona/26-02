let selectcategory = [];
let filterCategorys = {};
let selectToView = [];
function arrayUnique(array) {
	const a = array.concat();
	for (let i = 0; i < a.length; ++i) {
		for (let j = i + 1; j < a.length; ++j) {
			if (a[i] === a[j]) {
				a.splice(j--, 1);
			}
		}
	}
	return a;
};

const showSelect = (cat) => {
	for (let i = 0; i < cat.length; i += 1) {
		$('.seleckt-block').append(`<span class="category-list-select-label" data-selectcategory = "${cat[i].idCategory}"> ${cat[i].nameCategory}</span>`);

	}
};


$(document).ready(() => {
	// создаем карту категорий
	const parentCategory = $('li.b-navigation-menu__item');
    // проходим по всем вариантам
	parentCategory.each((i, elem) => {
		// варианты (категории) верхнего уровня делаем ключами
		filterCategorys[$(elem).data('category')] = {};
		// получаем id категории
		let id = $(elem).data('category');
		console.log(id);
		let name = $(elem).children('.b-navigation-menu__item-right').find('span').text();
		filterCategorys[$(elem).data('category')].name = name;
		// присваиваем дефолтные значения выбрано/невыбрано
		if ($(elem).find('input').is(':checked')) {
			filterCategorys[$(elem).data('category')].checked = true;
		} else {
			filterCategorys[$(elem).data('category')].checked = false;
		}
		
      // ищем дочерние категории
      const childrenCategory = $(elem).next('ul.b-navigation-menu-drop-down').children('li');
      
      childrenCategory.each((j, chelem) => {
      	let id = $(chelem).data('category');
      	let name = $(chelem).find('span.b-navigation-menu-drop-down__item-category').text();
        // отрисовываем количество магазинов в категории
        // варианты (подкатегории) делаем ключами
        filterCategorys[$(elem).data('category')][$(chelem).data('category')] = {};
        // заполняем состояние выбрано/невыбрано
        filterCategorys[$(elem).data('category')][$(chelem).data('category')].name = name;
        if ($(chelem).find('input').is(':checked')) {
        	filterCategorys[$(elem).data('category')][$(chelem).data('category')].checked = true;
        } else {
        	filterCategorys[$(elem).data('category')][$(chelem).data('category')].checked = false;
        }
    });
  });
	console.log(filterCategorys);
	// добавляем выбранный элемент
	$(document).on('click', '.category-list-select-label', function (e) {
		console.log($(this).text());
		// $(this).data('selectcategory')
		let id = $(this).data('selectcategory');
		for (let j = 0; j < selectcategory.length; j += 1) {
			if (+selectcategory[j] === +id) {
				selectcategory.splice(j, 1);
			}
		}
		for (let j = 0; j < selectToView.length; j += 1) {
			if (+selectToView[j].idCategory === +id) {
				selectToView.splice(j, 1);
			}
		}
		$('.seleckt-block').children().remove();
		showSelect(selectToView);

	});
	$('[type=checkbox]').click(function (e) {
		const idCategory = $(this).parents('.b-navigation-menu__item, .b-navigation-menu-drop-down__item').data('category').toString();
		const nameCategory = $(this).parents('.b-navigation-menu__item, .b-navigation-menu-drop-down__item').find('span').text();

		// если категория выбрана
		if ($(e.target).is(':checked')) {
			console.log(idCategory + ' - ' + nameCategory);
			if(selectcategory.indexOf(idCategory) < 0) {
				/*$('.seleckt-block').append(`<span class="shops-list-cash-label" data-selectcategory = "${idCategory}"> ${nameCategory}</span>`);*/
				selectcategory.push(idCategory);
				// selectToView.push({idCategory: idCategory, nameCategory: nameCategory})
				selectcategory = arrayUnique(selectcategory);

				// если выбрана родительская категория
				// добавляем все подкатегории
				if (idCategory in filterCategorys) {
					filterCategorys[idCategory].checked = true;
					for (key in filterCategorys[idCategory]) {
						filterCategorys[idCategory][key].checked = true;
						// устанавливаем всем подкатегориям выбраны
						if (key !== 'checked' && key !== 'count' && key !== 'name') {
							$(`[data-category=${key}]`).find('input').prop('checked', true);
							selectcategory.push(key);
							selectToView.push({idCategory: key, nameCategory: filterCategorys[idCategory][key].name});
						}
					}

					selectcategory = arrayUnique(selectcategory);
					$('.seleckt-block').children().remove();
					// showSelect(selectToView);
				}

				showSelect(selectToView);
			}
			console.log(selectcategory);
			console.log(selectToView);
		} else {
			for (let j = 0; j < selectcategory.length; j += 1) {
				if (+selectcategory[j] === +idCategory) {
					selectcategory.splice(j, 1);
				}
			}
			// если снимаем родительскую категорию
			if (idCategory in filterCategorys) {
				for (let j = 0; j < selectToView.length; j += 1) {
					if (+selectToView[j].idCategory === +idCategory) {
						selectToView.splice(j, 1);
					}
				}
				// удаляем из подкатегорий
				for (let key in filterCategorys[idCategory]) {
					filterCategorys[idCategory][key].checked = false;

					// устанавливаем всем подкатегориям НЕ выбрано
					if (key !==  'checked' && key !== 'count' && key !== 'name') {
						$(`[data-category=${key}]`).find('input').prop('checked', false);
						for (let j = 0; j < selectcategory.length; j += 1) {
							if (+selectcategory[j] === +key) {
								selectcategory.splice(j, 1);
							}
						}
						for (let j = 0; j < selectToView.length; j += 1) {
							if (+selectToView[j].idCategory === +key) {
								selectToView.splice(j, 1);
							}
						}

					}

				}
			} else {
				for (let key in filterCategorys) {
					if (idCategory in filterCategorys[key]) {
						filterCategorys[key][idCategory].checked = false;
						$(`[data-category=${key}]`).find('input').prop('checked', false);
					}

				}
				for (let j = 0; j < selectcategory.length; j += 1) {
					if (+selectcategory[j] === +idCategory) {
						selectcategory.splice(j, 1);
					}
				}
				for (let j = 0; j < selectToView.length; j += 1) {
					if (+selectToView[j].idCategory === +idCategory) {
						selectToView.splice(j, 1);
					}
				}	

			}
			$('.seleckt-block').children().remove();
			showSelect(selectToView);
		}
	})
})