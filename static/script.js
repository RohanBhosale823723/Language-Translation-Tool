async function translateText() {
    const text = document.getElementById("inputText").value;
    const source = document.getElementById("sourceLanguage").value;
    const target = document.getElementById("targetLanguage").value;
    const output = document.getElementById("outputText");

    // Check empty input
    if (text.trim() === "") {
        output.value = "Please enter some text.";
        return;
    }

    // Show loading message
    output.value = "Translating...";

    try {
        const response = await fetch("/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text,
                source: source,
                target: target
            })
        });

        const data = await response.json();

        // Check server/API error
        if (!response.ok) {
            output.value = data.error || "Translation failed.";
            return;
        }

        // Show translated text
        if (data.translated_text) {
            output.value = data.translated_text;
        } else {
            output.value = "No translation received.";
        }

    } catch (error) {
        console.error("Translation Error:", error);
        output.value = "Translation error. Please try again.";
    }
}


// Copy Translation
function copyText() {
    const output = document.getElementById("outputText");

    if (output.value.trim() === "") {
        alert("Nothing to copy!");
        return;
    }

    navigator.clipboard.writeText(output.value)
        .then(() => {
            alert("Translation copied!");
        })
        .catch(() => {
            alert("Could not copy translation.");
        });
}