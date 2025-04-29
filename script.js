// ==UserScript==
// @name         Enable Selects and Buttons + Add Download Buttons with Correct Filename on watt-else.pro
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Enables inputs and adds download buttons that fetch and save files with correct filenames on watt-else.pro (PDFs, images, etc.)
// @author       You
// @match        https://watt-else.pro/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/ItsZeusX/WeHelpUserScript/refs/heads/main/script.js
// @downloadURL  https://raw.githubusercontent.com/ItsZeusX/WeHelpUserScript/refs/heads/main/script.js
// ==/UserScript==

(function() {
    'use strict';

    function EnableRelanceAndQualificationInputs() {
        let changed = false;

        const statutSelect = document.getElementById('statut_mandat_pfo');
        if (statutSelect && statutSelect.disabled) {
            statutSelect.disabled = false;
            changed = true;
        }

        const motifSelects = document.querySelectorAll('select[name="mandat_motifs_ko[]"]');
        motifSelects.forEach(select => {
            if (select.disabled) {
                select.disabled = false;
                changed = true;
            }
        });

        const changeButton = document.getElementById('change_mandat_status');
        if (changeButton) {
            if (changeButton.disabled) {
                changeButton.disabled = false;
                changed = true;
            }
            if (changeButton.classList.contains('disabled')) {
                changeButton.classList.remove('disabled');
                changed = true;
            }
        }

        const relanceButton = document.getElementById('pfo_relance_btn');
        if (relanceButton) {
            if (relanceButton.disabled) {
                relanceButton.disabled = false;
                changed = true;
            }
            if (relanceButton.classList.contains('disabled')) {
                relanceButton.classList.remove('disabled');
                changed = true;
            }
        }

        if (changed && observer) {
            observer.disconnect();
            console.log('All elements enabled. MutationObserver stopped.');
        }
    }

 function AddDownloadLinksToMtInfo() {
    const mtInfoLists = document.querySelectorAll('ul.mt-info');
    mtInfoLists.forEach(ul => {
        if (ul.dataset.linksAdded === 'true') return;

        const firstLi = ul.querySelector('li');
        if (firstLi) {
            const link = firstLi.querySelector('a');
            console.log(link)
            if (link) {
                // Try to get data-src first
                let fileUrl = link.getAttribute('data-src');

                // If data-src is not valid, fallback to href
                if (!fileUrl || !isValidUrl(fileUrl)) {
                    fileUrl = link.href;
                }

                if (fileUrl && isValidUrl(fileUrl)) {
                    const newLi = document.createElement('li');
                    const newA = document.createElement('a');
                    newA.className = 'btn default btn-outline nolock';
                    newA.href = '#'; // prevent default behavior
                    newA.innerHTML = '<i class="icon-magnifier"></i>';

                    // Attach click handler
                    newA.addEventListener('click', async (e) => {
                        e.preventDefault();
                        try {
                            const response = await fetch(fileUrl);
                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(blob);

                            const tempLink = document.createElement('a');
                            tempLink.href = url;

                            // Try to extract filename from headers first
                            const contentDisposition = response.headers.get('Content-Disposition');
                            let filename = getFilenameFromContentDisposition(contentDisposition);
                            if (!filename) {
                                filename = getFilenameFromURL(fileUrl);
                            }

                            tempLink.download = filename;
                            document.body.appendChild(tempLink);
                            tempLink.click();
                            document.body.removeChild(tempLink);
                            window.URL.revokeObjectURL(url);
                        } catch (error) {
                            console.error('Download failed:', error);
                        }
                    });

                    newLi.appendChild(newA);
                    ul.appendChild(newLi);
                    ul.dataset.linksAdded = 'true';
                }
            }
        }
    });
}

// Helper function to validate URL
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

    function getFilenameFromContentDisposition(contentDisposition) {
        if (!contentDisposition) return null;
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
            return filenameMatch[1].replace(/['"]/g, ''); // Remove any quotes
        }
        return null;
    }

    function getFilenameFromURL(url) {
        const parts = url.split('/');
        let filename = parts.pop() || 'downloaded_file';
        if (filename.includes('?')) {
            filename = filename.split('?')[0];
        }
        return filename;
    }

    EnableRelanceAndQualificationInputs();
    AddDownloadLinksToMtInfo();

    const observer = new MutationObserver(() => {
        EnableRelanceAndQualificationInputs();
        AddDownloadLinksToMtInfo();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
