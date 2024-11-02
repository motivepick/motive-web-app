// A workaround to avoid FOUC. The colors here must match the --bs-body-bg variable. This variable cannot
// be used directly because it takes time to load, causing the page to blink white in a dark theme.
(function () {
    function setBackground(color) {
        document.getElementsByTagName('html')[0].style.background = color
    }
    const dark = '#212529'
    const light = '#fff'
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setBackground(mediaQuery.matches ? dark : light)
    mediaQuery.onchange = function (e) {
        setBackground(e.matches ? dark : light)
    }
}())