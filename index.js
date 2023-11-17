const input = document.getElementById('floatingInput')
const autoCompleteList = document.getElementById("autoCompleteList")
const cardList = document.getElementById("card_group")
const debounce = function (fn, debounceTime) {
    let timer;

    return function () {
        clearTimeout(timer)
        timer = setTimeout(() => fn.apply(this, arguments), debounceTime)
    }
};

const renderList = function (list) {
    autoCompleteList.innerHTML = '';

    list.forEach((el, index) => {
        let li = createLi('li', ['list-group-item','list-group-item-action'], el['full_name'])
        li.dataset.repo = JSON.stringify({name: el['name'], owner: el['owner']['login'], stars: el['stargazers_count']})
        setTimeout(
            () => autoCompleteList.appendChild(li),
            50 * index)
    })
}

const createLi = function (tag, classNames, value) {
    let el = document.createElement(tag)
    classNames.forEach( e => el.classList.add(e))
    el.textContent = value
    return el
}

const createCard = function (repo) {
    let card = document.createElement('div')
    card.classList.add('card')
    card.classList.add('my-2')

    let row = document.createElement('div')
    row.classList.add('row')

    let col = document.createElement('div')
    col.classList.add('col')
    col.classList.add('card-body')
    col.classList.add('w-75')
    col.classList.add('ms-3')

    let repoName = document.createElement('p')
    let repoAuthor = document.createElement('p')
    let repoStars = document.createElement('p')
    repoName.textContent = `Name : ${repo.name}`
    repoAuthor.textContent = `Owner : ${repo.owner}`
    repoStars.textContent = `Stars : ${repo.stars}`

    col.appendChild(repoName)
    col.appendChild(repoAuthor)
    col.appendChild(repoStars)

    row.appendChild(col)

    // вставка шаблона с кнопкой удаления id = tmpl
    row.appendChild(tmpl.content.cloneNode(true));

    card.appendChild(row)

    return card
}

const addRepository = function (e) {
    if (e.target.classList.contains('list-group-item')) {
        let card = createCard(JSON.parse(e.target.dataset.repo))
        card.querySelector('.btn').onclick = () => card.parentNode.removeChild(card)
        cardList.appendChild(card)

        //очистка ввода
        autoCompleteList.innerHTML = '';
        input.value = ''
    }
}
autoCompleteList.addEventListener('click', addRepository)

let search = function (e) {
    if (this.value.trim()) {
        fetch("https://api.github.com/search/repositories?q=" + encodeURI(this.value.trim()) + "&per_page=5")
            .then(r => r.json())
            .then(r => renderList(r.items))
            .catch(alert)
    } else {
        autoCompleteList.innerHTML = '';
    }
}

search = debounce(search, 500)
input.addEventListener('input', search);