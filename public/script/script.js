$(()=>{
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    if(user !== null) {
        $('#log').hide();
        $('#reg').hide();
    }else{
        $('#reg').hide();
        $('#logout').hide();
        $('#but').hide();
    }
    $("#register").click((e)=>{
        e.preventDefault();
        const data = new FormData(document.getElementById("formRegister"));
        console.log(data);
        $.ajax({
            url: 'http://localhost:3333/users',
            data: data,
            processData: false,
            contentType: false,
            type: 'POST'
        }).then(response => {
            console.log(response);
            location.reload();
        })
    });

    $("#login").click((e)=>{
        e.preventDefault();
        const data = new FormData(document.getElementById("formLogin"));

        $.ajax({
            url: 'http://localhost:3333/users/sessions',
            data: data,
            processData: false,
            contentType: false,
            type: 'POST'
        }).then(response => {
            localStorage.setItem('user', JSON.stringify(response));
            location.reload();
        })
    });

    $("#logout").click((e)=>{
        e.preventDefault();
        const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        if(user !== null){
            const header = {"Token": user.token};
            $.ajax({
                url: 'http://localhost:3333/users/sessions',
                headers: header,
                processData: false,
                contentType: false,
                type: 'DELETE'
            }).then(() => {
                localStorage.removeItem('user');
                location.reload();
            })
        }
    });

    $("#bregister").click((e)=>{
        e.preventDefault();
        $('#reg').show();
        $('#log').hide();
    });

    function fotoRendring(){

        let application = $("#application");
        application.empty();
        let result_form = $(`<div id="result_form">`);
        let form = $(`<div id="form">`);
        let form_id = $(`<form method="post" id="ajax_form" action="">`).click((e)=> artistHandler(e));
        let mydiv = $(`<div id="mydiv" class="container">`);
        application.append(result_form,form,form_id,mydiv);
        const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        if(user !== null) {
            const header = {"Token": user.token};
            $.ajax({
                url: 'http://localhost:3333/users/foto',
                headers: header,
                processData: false,
                contentType: false,
                type: 'GET',
                dataType: 'html'
            }).then(response => {
                document.getElementById('ajax_form').innerHTML = response;
                getAllpostsArtists();
            });
        }
    }
    fotoRendring();



    const Artists =(response)=>{
        let div_classCol = $(`<div class="col-md-4">`);
        let  div = $(`<div id=${response._id} class="thumbnail">`);
        let image = $(`<img  alt="" width="150"/>`).attr('src', `http://localhost:3333/uploads/${response.image}`).click((e)=> PopUpFoto(response.image,e));
        let name = $(`<p>`).text(`Имя исполнителя: ${response.name}`);
        let information = $(`<p>`).text(`Информация: ${response.information}`);
        if(response.button === "1") {
            let deleteArtists = $(`<button type="button" class="btn btn-default">Delete by ID</button>`).click((e)=> deleteArtistsById(response._id,e));
            div.append(image, name, information, deleteArtists);
            div_classCol.append(div);
        }else{
            div.append(image, name, information);
            div_classCol.append(div);
        }
        return div_classCol;
    };

    const deleteArtistsById = (id,e) =>{
        e.preventDefault();
        let result_form = $("#result_form");
        let mydiv = $("#mydiv");
        const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        if(user !== null) {
            const header = {"Token": user.token};
            $.ajax({
                url: `http://localhost:3333/fotos/delete/${id}`,
                headers: header,
                type: 'DELETE'
            }).then(response => {
                result_form.empty();
                result_form.text(JSON.stringify(response));
                mydiv.empty();
                getAllpostsArtists();
            });
        }
    };

    const getAllpostsArtists = () => {
        let mydiv = $("#mydiv");
        const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        if(user !== null) {
            const header = {"Token": user.token};
            $.ajax({
                url: 'http://localhost:3333/fotos',
                headers: header,
                processData: false,
                contentType: false,
                type: 'GET'
            }).then((response) => {
                let i = 0;
                let container = [];
                let div_classCol = $(`<div class="row">`);
                let count = response.length;
                const artists = response.map((artist) => {
                    count--;
                    if (i<=2) {
                        container.push(Artists(artist));
                        i++;
                    }
                    if (i === 2 || count === 0) {
                        i=0;
                        return div_classCol.append(container);
                    }
                });
                mydiv.html(artists);
            });
        }
    };


    const getAllpostsArtistsNoUser = () => {
        let mydiv = $("#mydiv");
           $.ajax({
                url: 'http://localhost:3333/fotos/all',
                processData: false,
                contentType: false,
                type: 'GET'
            }).then((response) => {
                let i = 0;
                let container = [];
                let div_classCol = $(`<div class="row">`);
                let count = response.length;
                const artists = response.map((artist) => {
                    count--;
                    if (i<=2) {
                        container.push(Artists(artist));
                        i++;
                    }
                    if (i === 2 || count === 0) {
                        i=0;
                        return div_classCol.append(container);
                    }
                });
                mydiv.html(artists);
            });
    };
    getAllpostsArtistsNoUser();

    var imageResized, imageDataUrl;
    const artistHandler =(e) =>{
        if(e.target.id === "image") {
            const dataURLToBlob = function (dataURL) {
                let raw;
                let contentType;
                let parts;
                const BASE64_MARKER = ';base64,';
                if (dataURL.indexOf(BASE64_MARKER) === -1) {
                    parts = dataURL.split(',');
                    contentType = parts[0].split(':')[1];
                    raw = parts[1];

                    return new Blob([raw], {type: contentType});
                }

                parts = dataURL.split(BASE64_MARKER);
                raw = window.atob(parts[1]);
                const rawLength = raw.length;

                const uInt8Array = new Uint8Array(rawLength);

                for (let i = 0; i < rawLength; ++i) {
                    uInt8Array[i] = raw.charCodeAt(i);
                }

                return new Blob([uInt8Array], {type: "image/jpg"});
            };
            image.addEventListener("change", doOpen, false);

            function doOpen(evt) {
                let canvas = document.createElement("canvas");
                let file = evt.target.files[0];
                let reader = new FileReader();

                reader.onload = function (readerEvent) {
                    const img = new Image();
                    img.onload = function () {
                        let ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0);
                        let width = 150;
                        let height = 100;
                        canvas.width = 150;
                        canvas.height =100;
                        ctx.drawImage(img, 0, 0, width, height);
                        imageDataUrl = canvas.toDataURL('image/jpeg');
                        console.log(imageDataUrl);
                        imageResized = dataURLToBlob(imageDataUrl);
                        console.log(imageResized);
                    };
                    img.src = readerEvent.target.result;
                    evt.target.files[0] = readerEvent.target.result;
                };

                if (file) {
                    reader.readAsDataURL(file);
                }
            }
        }
        if(e.target.id === "btn_artist"){
            let idForm = $("#ajax_form");
            if(!idForm[0].checkValidity()){
                $('<input type="submit">').hide().appendTo(idForm).click().remove();
                return;
            }
            e.preventDefault();
            let result_form = $("#result_form");
            let mydiv = $("#mydiv");
            const data = new FormData(document.getElementById("ajax_form"));
            data.delete("image");
            data.append("image",imageResized,"1.jpeg");
            const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
            if(user !== null) {
                const header = {"Token": user.token};
                $.ajax({
                    url: 'http://localhost:3333/fotos',
                    data: data,
                    headers: header,
                    processData: false,
                    contentType: false,
                    type: 'POST'
                }).then((response) => {
                    result_form.empty();
                    result_form.text(JSON.stringify(response));
                    mydiv.empty();
                    getAllpostsArtists();
                });
            }
        }

     };

    const PopUpFoto =(id,e) =>{
        e.preventDefault();
        $('#myModal').modal(focus);
        $('#fotoId').attr('src', `http://localhost:3333/uploads/${id}`);
    };
});