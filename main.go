package main

import (
	"fmt"
	"net/http"
)

func main() {
	port := "3000"
	fmt.Println(fmt.Sprintf("WebPage Addr: http://localhost:%s/mainPage.html", port))
	http.Handle("/", http.FileServer(http.Dir("./static")))
	http.ListenAndServe(":3000", nil)
}
