var app = {}; 

var Image = Backbone.Model.extend({
    defaults: {
        title: '',
        completed: false
    }
});

var SmallImages = Backbone.Collection.extend({
    model: Image,
    url: 'http://api.getchute.com/v2/albums/auiNmgrw/assets',
    parse: function (resp) {
        return resp.data;
    }
});

var BigImages = Backbone.Collection.extend({
    model: Image,
    url: 'http://api.getchute.com/v2/albums/auiMsoyv/assets',
    parse: function (resp) {
        return resp.data;
    }
});

var AppRouter = Backbone.Router.extend({
    routes: {
        "": 'showDisplay'
    },
    showDisplay: function() {
        var small = new SmallImages();

        var big = new BigImages();

        $.when(small.fetch({ data: {per_page: 100 }}), big.fetch({ data: {per_page: 10 }})).then(function() {
            app.appView = new app.AppView({small: small, big: big})
        })
    }
});

var app_router = new AppRouter();

var ImagesView = Backbone.View.extend({
    initialize: function (options) {
        this.model = options.model
    },

    render: function () {

        var myTemplateHtml = _.template($('#image-template').html()); 
        var templateData = this.model.attributes
        var myRenderedTemplateHtml = myTemplateHtml(templateData);
        this.$el = myRenderedTemplateHtml;
        return this
    }
});

app.AppView = Backbone.View.extend({
  el: '#content',
  initialize: function (options) {
    this.small = options.small
    this.big = options.big

    this.small.each(function(asset) {

        var myImagesView = new ImagesView({model: asset});
        $('#parallax2').append(myImagesView.render().$el)

    });
    this.big.each(function(asset) {


        var myImagesView = new ImagesView({model: asset });
        $('#parallax1').append(myImagesView.render().$el)

    });

    $('img').on('error', function(e) {
        $(this).remove();
    })


    scrollorama = $.scrollorama({ blocks:'.scrollblock' });
    var height = $('#parallax1').height();
    scrollorama.animate('#parallax2',{ delay: 0, duration: height, property:'top', start:0, end:-1 * height });

}

});

Backbone.history.start();

