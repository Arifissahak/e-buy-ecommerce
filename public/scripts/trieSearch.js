class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

class AutocompleteTrie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        for (const char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
    }

    search(prefix) {
        let node = this.root;
        for (const char of prefix) {
            if (!node.children[char]) {
                return [];
            }
            node = node.children[char];
        }

        const suggestions = [];
        this._findWordsWithPrefix(node, prefix, suggestions);
        return suggestions;
    }

    _findWordsWithPrefix(node, currentPrefix, suggestions) {
        if (node.isEndOfWord) {
            suggestions.push(currentPrefix);
        }

        for (const char in node.children) {
            this._findWordsWithPrefix(node.children[char], currentPrefix + char, suggestions);
        }
    }
}
let searchTrie = new AutocompleteTrie()

function insertSearchTrie() {
    fetch('/search-products')
        .then(res => res.json())
        .then((res) => {
            if (res.success) {
                insertTrie(res.productNames)
            }
        })

    function insertTrie(names) {
        for (let each of names) {
            searchTrie.insert(each.productName)
        }
    }

}

insertSearchTrie()



const searchInput = document.getElementById('searchItemInput');
const searchBtn = document.getElementById('searchButton')
const list = document.getElementById('item-list');

searchInput.addEventListener('input', function () {
    const searchValue = searchInput.value.toLowerCase();

    if(searchInput.value === ""){
        return list.innerHTML = ""
    }

    const items = searchTrie.search(searchValue)
    if (items.length > 0) {
        let lis = ''
        for (let each of items) {
           let li = `<li onclick="liSearch(this.textContent)" >${each}</li>`
            lis+=li
        }
        list.innerHTML = lis
    }else{
        list.innerHTML = ''
    }

});

function liSearch (val){
    searchInput.value = val
    list.innerHTML=''
}

searchBtn.addEventListener('click',()=>{
    const value = searchInput.value
    if(value){
        fetch(`/sort/${value}`)
        .then(res => res.json())
        .then((res) => {
            if (res.success) {
                if(res.products.length == 0){
                    const productRow = document.getElementById('productsRow')
                    return productRow.innerHTML = ''
                }
                sortedProducts(res.products)
            }
        })
    }
})






