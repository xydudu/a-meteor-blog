var 
Article = new Meteor.Collection('article'),
User = new Meteor.Collection('user');

Session.set("article_id", null);
Session.set("article", null);

var 
listTpl = Template.list,
contentTpl = Template.content,
mainTpl = Template.main;

Template.header.events = {
    'click h1>a': function() {
        Router.changeTo( '' );
        return false;
    }
};

mainTpl.display = function( _where ) {
    var state = 'list';
    if ( Session.get('article_id') ) {
        state = 'content';
    } else {
        state = 'list';
    }
    if ( Session.get('backend') )
        state = Session.get('backend');

    return state === _where;
};

listTpl.list = function() {
    return Article.find({});
};
listTpl.formarttime = function() {
    return moment( this.createtime ).fromNow();
}
listTpl.events = {
    'click li>a': function( _e ) {
        var key = _e.target.id;
        Router.changeTo( key );
        return false;
    }
};

Template.post.err = function() {
    return Session.get( 'post-err' ); 
};

Template.post.events = {
    'click #submit': function() {
        var
        title = $('#title').val(),
        content = $('#content').val(),
        tags = $('#tags').val().split(',');

        if ( title === '') {
            Session.set('post-err', 'Please make sure "Title" is not empty!'); 
            return;
        }
        if ( content === '') {
            Session.set('post-err', 'Please make sure "Content" is not empty!'); 
            return;
        }


        var _id = Article.insert({
            title: title,
            content: content,
            tags: tags,
            createtime: new Date().getTime(),
            author: $.cookie('admin')
        });

        Router.changeTo( _id );
    }
};
Template.login.events = {
    'click #submit': function() {
        var 
        username = $('#username').val(),
        password = $('#password').val(),
        admin =  User.findOne({
            username: username,
            password: password});

        if ( admin ) {
            Session.set('backend', 'post');
            $.cookie('admin', admin.username);
        } else {
            alert('Wrong user!');
            Router.changeTo('');
        }
        
    },
    'click #cancel': function() {
        Router.changeTo('');
    }
};

contentTpl.formarttime = function() {
    return moment( this.createtime ).fromNow();
};
contentTpl.article = function() {
    var 
    _id = Session.get('article_id'),
    article = Article.findOne(_id);
    if (!article) return {};
    article.content = article.content.replace(/(\n|\r)/ig, '<br />');
    return article;
};

/// router
var Blog = Backbone.Router.extend({
    routes: {
        "admin": "backend",
        ":article_id": "showArticle",
        "": 'index'
    },
    index: function() {
        Session.set("article_id", null);
        Session.set("backend", null);
    },
    backend: function() {

        if ($.cookie('admin')) {
            Session.set("backend", 'post');
        } else {
            Session.set("backend", 'login');
        }
    },
    showArticle: function ( _id ) {
        Session.set("article_id", _id);
        Session.set("backend", null);
    },
    changeTo: function( _id ) {
        this.navigate(_id, true);
    }
    
});

Router = new Blog();
Meteor.startup(function () {
    var footer = $('footer');
    footer.html(Meteor.ui.render(function () {
        var html = '<p>@xydudu <a href="/admin">Post</a></p>';
        if ( Session.get('backend') )
            html = '<p>@xydudu</p>';
        return html;
    }))
    .delegate('a', 'click', function() {
        Router.changeTo( 'admin' );
        return false;
    });
    Backbone.history.start({pushState: true});
});
