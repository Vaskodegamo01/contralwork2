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

    function NewsRendring(){
        let application = $("#application");
        application.empty();
        let result_form = $(`<div id="result_form">`);
        let form = $(`<div id="form">`);
        let form_id = $(`<form method="post" id="ajax_form" action="">`).click((e)=> NewsHandler(e));
        let mydiv = $(`<div id="mydiv" class="container">`);
        application.append(result_form,form,form_id,mydiv);
        const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        if(user !== null) {
            const header = {"Token": user.token};
            $.ajax({
                url: 'http://localhost:3333/users/news',
                headers: header,
                processData: false,
                contentType: false,
                type: 'GET',
                dataType: 'html'
            }).then((response) => {
                document.getElementById('ajax_form').innerHTML = response;
                $.ajax({
                    url: 'http://localhost:3333/news',
                    headers: header,
                    processData: false,
                    contentType: false,
                    type: 'GET',
                    dataType: 'html'
                }).then((response) => {
                    response = JSON.parse(response);
                    let my = $("#mydiv");
                    let i = 0;
                    let container = [];
                    let div_classCol = $(`<div class="row">`);
                    let count = response.length;
                    const news = response.map((news) => {
                        count--;
                        if (i<=2) {
                            container.push(News(news));
                            i++;
                        }
                        if (i === 2 || count === 0) {
                            i=0;
                            return div_classCol.append(container);
                        }
                    });
                    my.html(news);
                })
            })
        }
    }
    const News =(response)=>{
        let div_classCol = $(`<div class="col-md-4">`);
        let  div = $(`<div id=${response._id} class="thumbnail">`);
        let image = $(`<img  alt="" width="150"/>`).attr('src', `http://localhost:3333/uploads/${response.image}`);
        let title = $(`<p>`).text(`Заголовок: ${response.title}`);
        let post = $(`<button type="button" class="btn btn-default">Читать полностью</button>`).click((e)=> PopUpNews(response._id,e));
        if(response.button === "1") {
            let deleteComments = $(`<button type="button" class="btn btn-default">Delete by ID</button>`).click((e)=> deleteNewsById(response._id,e));
            div.append(image, title, post, deleteComments);
            div_classCol.append(div);
        }else{
            div.append(image, title, post);
            div_classCol.append(div);
        }
        return div_classCol;
    };

    const deleteNewsById = (id,e) =>{
        e.preventDefault();
        let result_form = $("#result_form");
        let mydiv = $("#mydiv");
        const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        if(user !== null) {
            const header = {"Token": user.token};
            $.ajax({
                url: `http://localhost:3333/news/${id}`,
                headers: header,
                type: 'DELETE'
            }).then((response) => {
                result_form.empty();
                result_form.text(JSON.stringify(response));
                mydiv.empty();
                $.ajax({
                    url: 'http://localhost:3333/news',
                    headers: header,
                    processData: false,
                    contentType: false,
                    type: 'GET',
                    dataType: 'html'
                }).then((response) => {
                    response = JSON.parse(response);
                    let i = 0;
                    let container = [];
                    let div_classCol = $(`<div class="row">`);
                    let count = response.length;
                    const news = response.map((news) => {
                        count--;
                        if (i<=2) {
                            container.push(News(news));
                            i++;
                        }
                        if (i === 2 || count === 0) {
                            i=0;
                            return div_classCol.append(container);
                        }
                    });
                    mydiv.html(news);
                })
            });
        }
    };

    const getAllpostsNews = () => {
        let application = $("#application");
        application.empty();
        let mydiv = $(`<div id="mydiv" class="container">`);
        application.append(mydiv);
         $.ajax({
                url: 'http://localhost:3333/news',
                processData: false,
                contentType: false,
                type: 'GET'
            }).then((response) => {
             let my = $("#mydiv");
                let i = 0;
                let container = [];
                let div_classCol = $(`<div class="row">`);
                let count = response.length;
                const news = response.map((news) => {
                    count--;
                    if (i<=2) {
                        container.push(News(news));
                        i++;
                    }
                    if (i === 2 || count === 0) {
                        i=0;
                        return div_classCol.append(container);
                    }
                });
             my.html(news);
            });
    };

    var imageResized, imageDataUrl;
    const NewsHandler =(e) =>{
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
                    url: 'http://localhost:3333/news',
                    data: data,
                    headers: header,
                    processData: false,
                    contentType: false,
                    type: 'POST'
                }).then((response) => {
                    result_form.empty();
                    result_form.text(JSON.stringify(response));
                    mydiv.empty();
                    $.ajax({
                        url: 'http://localhost:3333/news',
                        headers: header,
                        processData: false,
                        contentType: false,
                        type: 'GET',
                        dataType: 'html'
                    }).then((response) => {
                        response = JSON.parse(response);
                        let i = 0;
                        let container = [];
                        let div_classCol = $(`<div class="row">`);
                        let count = response.length;
                        const news = response.map((news) => {
                            count--;
                            if (i<=2) {
                                container.push(News(news));
                                i++;
                            }
                            if (i === 2 || count === 0) {
                                i=0;
                                return div_classCol.append(container);
                            }
                        });
                        mydiv.html(news);
                    })
                });
            }
        }

     };
    if(user !== null) {
        NewsRendring();
    }else{
        getAllpostsNews();
    }
   getNewsById = (id) => {
        $.ajax({
            url: `http://localhost:3333/news/${id}`,
            processData: false,
            contentType: false,
            type: 'GET',
            dataType: 'html'
        }).then((response) => {
            let modal = $("#modalmydiv");
            response = JSON.parse(response);
            let div_classCol = $(`<div class="col-md-4">`);
            let div_news = $(`<div id="div_news">`);
            let  div = $(`<div id=${response._id} class="thumbnail">`);
            let image = $(`<img  alt="" width="150"/>`).attr('src', `http://localhost:3333/uploads/${response.image}`);
            let title = $(`<p>`).text(`Заголовок: ${response.title}`);
            let data = $(`<p>`).text(`Новость: ${response.data}`);
            let time = $(`<p>`).text(`время создания: ${response.time}`);
            let div_comments = $(`<div id="div_comments">`);
            div.append(image, title, data, time);
            div_news.append(div);
            div_classCol.append(div_news,div_comments);
            modal.html(div_classCol);
        }).then(
            $.ajax({
                url: `http://localhost:3333/comments?news_id=${id}`,
                processData: false,
                contentType: false,
                type: 'GET',
                dataType: 'html'
            }).then((response) => {
                let div_c = $("#div_comments");
                response = JSON.parse(response);
                let divRow = $(`<div class="row">`);
                const comments = response.map((comments) => {
                    let comment = $(`<p>`).text(`коментарий: ${comments.comments}`);
                    return divRow.append(comment);
                });
                //console.log(comments[0]);
                div_c.html(comments[0]);
            })
        )
    }

    const PopUpNews =async  (id,e) =>{
        let modal = $("#modal");
        e.preventDefault();
        $('#myModal').modal(focus);
        let result_form = $(`<div id="modal_result_form">`);
        let form = $(`<div id="form">`);
        let form_id = $(`<form method="post" id="ajax_form" action="">`);
        let div_name = $(`<div class="form-group">`);
        let label_comments = $(`<label for="comments">Коментарий</label>`);
        let input_comments = $(`<input type="text" class="form-control" id="comments" name="comments" required>`);
        let name = div_name.append(label_comments, input_comments);
        let div_style = $(`<div style="overflow: hidden; padding-right: .5em;">`);
        let input_button = $(`<input type="submit" id="btn_album" class="btn btn-primary" value="Отправить">`).click((e)=> FullNewsHandler(e));
        let button = div_style.append(input_button);
        form_id.append(name,button);
        let mydiv = $(`<div id="modalmydiv" class="container">`);
        modal.append(result_form,form,form_id,mydiv);
        getNewsById(id)
    };
});

const FullNewsHandler =(e) =>{
        let idForm = $("#ajax_form");
        if(!idForm[0].checkValidity()){
            $('<input type="submit">').hide().appendTo(idForm).click().remove();
            return;
        }
        e.preventDefault();
        let result_form = $("#result_form");
        let mydiv = $("#mydiv");
        const data = new FormData(document.getElementById("ajax_form"));
        const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        if(user !== null) {
            const header = {"Token": user.token};
            $.ajax({
                url: 'http://localhost:3333/comments',
                data: data,
                headers: header,
                processData: false,
                contentType: false,
                type: 'POST'
            }).then((response) => {
                result_form.empty();
                result_form.text(JSON.stringify(response));
                mydiv.empty();
                $.ajax({
                    url: 'http://localhost:3333/news',
                    headers: header,
                    processData: false,
                    contentType: false,
                    type: 'GET',
                    dataType: 'html'
                }).then((response) => {
                    response = JSON.parse(response);
                    let i = 0;
                    let container = [];
                    let div_classCol = $(`<div class="row">`);
                    let count = response.length;
                    const news = response.map((news) => {
                        count--;
                        if (i<=2) {
                            container.push(News(news));
                            i++;
                        }
                        if (i === 2 || count === 0) {
                            i=0;
                            return div_classCol.append(container);
                        }
                    });
                    mydiv.html(news);
                })
            });
        }
    };