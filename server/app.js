var
Article = new Meteor.Collection('article'),
User = new Meteor.Collection('user');


Meteor.startup(function() {
    
    if (Article.find().count() === 0) {
         Article.insert({
             title: 'Hello World',
             author: 'xydudu',
             content: 'Some text here....',
             tags: ['hello', 'w3ctech'],
             createtime: new Date().getTime()
         });
    }
    if (User.find().count() === 0) {
         User.insert({
             username: 'xydudu',
             password: '123321'
         });
    }

});
