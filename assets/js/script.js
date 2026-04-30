document.addEventListener("DOMContentLoaded", () => {
	const navToggle = document.getElementById("navToggle");
	const navMenu = document.getElementById("navMenu");
	const navbar = document.querySelector(".navbar");
	const navLinks = document.querySelectorAll(".nav-link");
	const sections = document.querySelectorAll("section[id]");

	if (navToggle && navMenu) {
		navToggle.addEventListener("click", () => {
			navMenu.classList.toggle("open");
			navToggle.classList.toggle("open");
		});

		navLinks.forEach((link) => {
			link.addEventListener("click", () => {
				navMenu.classList.remove("open");
				navToggle.classList.remove("open");
			});
		});
	}

	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener("click", (event) => {
			const targetId = anchor.getAttribute("href");
			if (!targetId || targetId.length <= 1) {
				return;
			}

			const targetSection = document.querySelector(targetId);
			if (targetSection) {
				event.preventDefault();
				targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		});
	});

	const updateScrollState = () => {
		if (navbar) {
			if (window.scrollY > 10) {
				navbar.classList.add("scrolled");
			} else {
				navbar.classList.remove("scrolled");
			}
		}

		let currentId = "";
		const scrollPosition = window.scrollY + 140;

		sections.forEach((section) => {
			if (
				scrollPosition >= section.offsetTop &&
				scrollPosition < section.offsetTop + section.offsetHeight
			) {
				currentId = section.getAttribute("id") || "";
			}
		});

		navLinks.forEach((link) => {
			link.classList.remove("active");
			const href = link.getAttribute("href");
			if (href && href.startsWith("#") && href.substring(1) === currentId) {
				link.classList.add("active");
			}
		});
	};

	updateScrollState();
	window.addEventListener("scroll", updateScrollState);
});
