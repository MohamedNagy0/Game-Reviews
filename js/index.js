// HTML Elements
const navLi = $("nav li");
const allLinks = Array.from(document.querySelectorAll("ul li a"));
const blurGamesInfo = document.querySelector(".blur-games-info");
const searchInput = document.querySelector(".searchInput");

// Global Variables
let nameOfCat = "Fighting";
let currentGameId;

//  Get Games api by category name
async function getGames(nameOfCat) {
    showLoadingAndHideScroll();

    const options = {
        method: "GET",
        headers: {
            "X-RapidAPI-Key":
                "761b8a3226msh868f0d927cb6ea4p117ef0jsn46d63d281712",
            "X-RapidAPI-Host": "free-to-play-games-database.p.rapidapi.com",
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    const api = await fetch(
        `https://free-to-play-games-database.p.rapidapi.com/api/games?category=${nameOfCat}`,
        options
    );

    const response = await api.json();
    disableLoadingAndShowScroll();

    displayGamesByCat(response);

    //Search
    searchInput.addEventListener("input", () => {
        displayGamesByCat(response);
    });
}
getGames(nameOfCat);

function displayGamesByCat(arr) {
    let gamsContainer = document.querySelector(".gamsContainer");

    const filterData = arr.filter((game) =>
        game.title.toLowerCase().includes(searchInput.value.toLowerCase())
    );

    let innerGamesBox = "";

    for (let i = 0; i < filterData.length; i++) {
        innerGamesBox += `
        <div class="col-md-6 col-lg-4 allIds  px-2" da-id="${filterData[i].id}">
        <div
            class="inner-games h-100 py-3 rounded-3 text-white card overflow-hidden  d-flex flex-column justify-content-between  align-items-center"
        >
            <header class="games-img w-100 px-3">
                <img
                    src="${filterData[i].thumbnail}"
                    class="w-100"
                    alt="${filterData[i].short_description.slice(0, 50)}"
                />
            </header>
            <div
                class="caption d-flex justify-content-between align-items-center mt-2 w-100 px-3"
            >
                <h2 class="mb-0 h5 text-info fw-bold">${
                    filterData[i].title
                }</h2>
                <span class="p-2  fw-bold bg-success rounded-3 fs-14"
                    >Free</span
                >
            </div>
            <p class="text-center pt-2 px-3  fw-semibold">
            ${filterData[i].short_description}
            </p>
            <footer
                class="d-flex inner-footer px-3 pt-3 justify-content-between border border-start-0 border-bottom-0 border-end-0 border-1  border-dark w-100"
            >
                <span
                    class="  orange text-dark fw-bold rounded-3 fs-13 py-1 px-2"
                    >${filterData[i].genre}</span
                >
                <span
                    class=" blue    text-white   fw-bold rounded-3 fs-13 py-1 px-2"
                    >${filterData[i].platform}</span
                >
            </footer>
        </div>
    </div>
        `;
    }

    if (filterData.length != 0) {
        gamsContainer.innerHTML = innerGamesBox;
    } else {
        gamsContainer.innerHTML =
            "<h2 class='text-center'><span class='text-white fs-4 orange px-4 py-2 rounded-5'>Oops! No Games Found</span></h2>";
    }

    const allIds = Array.from(document.querySelectorAll(".allIds"));
    for (i = 0; i < filterData.length; i++) {
        allIds[i].addEventListener("click", function () {
            currentGameId = this.getAttribute("da-id");
            getGamesDetails(currentGameId);
            showGamesInfo();
        });
    }
}

function gatingNameOfCategory() {
    for (let i = 0; i < allLinks.length; i++) {
        allLinks[i].addEventListener("click", () => {
            changeActive(i);
            nameOfCat = allLinks[i].innerHTML;
            getGames(nameOfCat);
        });
    }
}
gatingNameOfCategory();

function changeActive(i) {
    const activeLink = document.querySelector(".active");
    activeLink.classList.remove("active");
    allLinks[i].classList.add("active");
}

//  Get Games information api by
async function getGamesDetails(currentGameId) {
    showLoadingAndHideScroll();
    const options = {
        method: "GET",
        headers: {
            "X-RapidAPI-Key":
                "761b8a3226msh868f0d927cb6ea4p117ef0jsn46d63d281712",
            "X-RapidAPI-Host": "free-to-play-games-database.p.rapidapi.com",
        },
    };
    const url = await fetch(
        `https://free-to-play-games-database.p.rapidapi.com/api/game?id=${currentGameId}`,
        options
    );

    const response = await url.json();
    disableLoadingAndShowScroll();
    displayGameInfo(response);
}

function displayGameInfo({
    thumbnail,
    description,
    title,
    genre,
    platform,
    status,
    short_description,
    game_url,
}) {
    const gamesInfoContainer = document.querySelector(".gamesInfoContainer");
    gamesInfoContainer.innerHTML = `
    <div class="col-12">
    <div
        class="inner-img-info mb-2 d-flex justify-content-center align-items-center"
    >
        <img
        class="imgInfo"
            src="${thumbnail}"
            alt="${description}"
        />
    </div>
</div>
<div class="col-md-6">
    <div class="info-caption ps-1">
        <h2
            class="w-100  text-center text-md-start mb-3 text-info fw-bold"
        >
        ${title}
        </h2>
        <h3 class="fs-6 fw-semibold">
            Category:
            <span class="fs-14 textOrange">${genre}</span>
        </h3>
        <h3 class="fs-6 fw-semibold">
            Platform:
            <span class="fs-14 textBlue">${platform}</span>
        </h3>
        <h3 class="fs-6 fw-semibold">
            Status: <span class="fs-14 textRed">${status}</span>
        </h3>
    </div>
</div>
<div class="col-md-6">
    <div class="info-dis pe-1">
        <p class="lead fs-6">
        ${short_description}
        </p>
    </div>
</div>
<div class="col-12 mt-3 text-center">
    <a
        href="${game_url}" target="_blank"
        class="text-dark bg-info p-4 rounded-4 py-2 fw-bold"
        >Play Now!</a
    >
</div>

    `;
}

function showGamesInfo() {
    blurGamesInfo.classList.replace("d-none", "flex");
}

//Display loader
function showLoadingAndHideScroll() {
    document.querySelector(".loading").classList.replace("d-none", "d-flex");
    document.body.classList.add("overflow-hidden");
}

function disableLoadingAndShowScroll() {
    setTimeout(() => {
        document
            .querySelector(".loading")
            .classList.replace("d-flex", "d-none");
        document.body.classList.remove("overflow-hidden");
    }, 300);
}
//Display loader

//~ events

// CLOSE Model
$(".fa-circle-xmark").on("click", () => {
    $(".blur-games-info").addClass("d-none");
});

// Close down nav when I click on any Li
for (let i = 0; i < navLi.length; i++) {
    navLi.eq(i).on("click", () => {
        $(".navbar-collapse").removeClass("show");
    });
}
// CLOSE Model
$(".blur-games-info").on("click", function (e) {
    if (e.target === $(".blur-games-info")[0]) {
        $(".blur-games-info").addClass("d-none");
    }
});
