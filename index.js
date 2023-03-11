class Manifest {
    contructor(category, text) {
        this.category = category;
        this.text = text;
       
    }
}
    
class ManifestService {
    static url = "https://640a9e6481d8a32198cc7498.mockapi.io/manifests"

    static getAllManifests() {
        return $.get(this.url);
    }
    
    static getManifest(id) {
        return $.get(this.url + `/${id}`);
    }

    static createManifest(manifest) {
        return $.post(this.url, manifest);
    }

    static updateManifest(manifest) {
        return $.ajax({
            url: this.url + `/${manifest.id}`,
            dataType: 'json',
            data: JSON.stringify(manifest),
            contentType: 'application/json',
            type: 'PUT'
        });
    }
    static deleteManifest(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

class DOMManager {
    static manifests;

    static getAllManifests() {
        ManifestService.getAllManifests().then(manifests => this.render(manifests));

    }

static createManifest(category, text) {
    ManifestService.createManifest(new Manifest(category, text))
      .then(() => {
        return ManifestService.getAllManifests();
      })
      .then((manifests) => this.render(manifests));
}

    static deleteManifest(id) {
        ManifestService.deleteManifest(id)
            .then(() => {
               return ManifestService.getAllManifests();
             })
             .then((manifests) => this.render(manifests));
    }

   
    static render(manifests) {
        this.manifests = manifests;
        $("#app").empty();
        for(let manifest of manifests) {
            $("#app").prepend(`
                <div id="${manifest.id}" class="card">
                    <div class="card-header">
                      <center><h2>${manifest.category}</h2></center>
                      <button class="btn btn-danger" onclick="DOMManager.deleteManifest('${manifest.id}')">Delete</button>
                    </div>
                    <div class="card-body">
                       <div class="card">
                          <div class="row">
                            <h4>${manifest.text}</h4>
                          </div><br>
                        </div>
                    </div>   
                </div><br>`
           
            );
        
        }
    }
}

$('#create-new-manifest').click(() => {
    DOMManager.createManifest($("#new-manifest-category").val(), $("#new-manifest-text").val());
    $("#new-manifest-category").val("");
    $("#new-manifest-text").val("");

}); 
DOMManager.getAllManifests();
