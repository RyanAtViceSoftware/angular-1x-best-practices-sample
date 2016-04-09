# Angular 1.x Best Practices
Sample code from my Angular 1.x Best Practices and Lessons Learned talk. In this talk I'm covering best practices that I've used successfully with large distributed teams on large code bases for high volume sites over long periods of time.

### Running Code

1. Clone repository or download zip file and extract it.
1. Start a local server by executing ```http-server```
1. Browse to IP and port created by http-server, http://127.0.0.1:8080/ on my machine

### Running Tests

1. ```karma start```

# Session Notes
We covered the following topics in these talks.

## Debugging Tips

Learn to use chrome for development
  * Workspaces
  * Debugging using ```angular.element($0).scope()```

## Find a Good Starting Point
We like John Papa: https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md

### controllerAs
      
**Branches**
* john-papa-1-controller-as-tests-failing

  ```git checkout john-papa-1-controller-as-tests-failing```
* john-papa-2-controller-as-tests-passing

  ```git checkout john-papa-1-controller-as-tests-passing```

**Benifits**
* Discourages scope inheritance
  * Keeps bindings explicit
  * There's always a . in your binding
  * Encourages using isolated scopes in directives
* Greatly reduces coupling to $scope in controllers
* Allows for easily nesting scopes and avoiding name collisions
          
### $inject and named functions instead of inline functions

**Branches**
* john-papa-3-inject

  ```git checkout john-papa-3-inject```

**Benifits**
  * Minification safe
  * More concise and less confusing than inline inejection
  * Named functions give you a stack trace
  * Named functions spread code out a bit and make it easier to read

## Code Organization and Promises
You can make your code easier to test and reason about using the following approaches.

### Keep Your Promise Chains Flat
The whole point is avoiding the pyramid of doom

**Branches**
* flatten-promises

  ```git checkout flatten-promises```

**Benifits**
  * Improves readability
  * The point of promises is to reduce the pain of they pyramid of doom

### Stateful Services (Domain Model)
Moving the server side web page code to the client doesn't mean we have to come up with all new patterns, EAA patterns and DDD patterns still apply. The only difference is that instead of a DB we are talking to a REST API. Also, everything in Angular that isn't a Service (Provider, Factory) is harder to test than a Service so put code you want to test in Services.

#### Architecture
I find using the same patterns as you would use for a server side web application works well as shown in the digram below. 

![image](https://cloud.githubusercontent.com/assets/10080111/14267374/76d53016-fa95-11e5-8e82-9003138396d2.png)

I also find that Domain Model appoarch works a little better than anemic model with domain services. This is because you will already be creating stateful services to hang your state and functionality off of and that is basically what a Entity is in a rich domain model. We find that our services end up being either VMs (View Models), Domain Services or Domain Entities depending on how they are used.

* View Model: When your service has state and logic for a single view
* Domain Entity: When your service has state and logic for more than one view
* Domain Service: When your serivce contains orchestration logic across multiple Domain Entities

We generally start with VMs and let the service evolve with our code over time.

**Branches**
* stateful-services-promise-mess 
 ```git checkout stateful-services-promise-mess ```
* stateful-services 
 ```git checkout stateful-services```

**Benifits**
  * Easier to test
  * Allows for reuse across controllers, directives, filters, etc...
  * Tried and true patterns

## Asynchronous Execution
We've looked at synchronous promise execution (i.e. one after the other) now let's look at asynchronous promise execution.

**Branches**
* stateful-services-parrallel 
 ```git checkout stateful-services-parrallel```
* stateful-services-parrallel-2 
 ```git checkout stateful-services-parrallel-2```

**Benifits**
  * Simplifies synchronizing code to run after all promises complete (i.e. busy spinner, model update, etc...)

## Data Template Pattern
Often we need to have our data drive what html is loaded in our view and to dynamically change the view as the data changes. Here's a simple pattern to accomplish this.

**Branches**
* data-template 
 ```git data-template```

**Benifits**
  * Allows testing without config setting that break tests
  * Simpler than creating a testing module

## Module Oganization for Testing
Sometimes our modules ```.config()``` can break tests. To fix this seperate your module into two modules 1) module for config 2) module for everything else. Then have config module depend on app module.

**Branches**
* routing 
 ```git checkout routing```
* routing-fixed-tests 
 ```git routing-fixed-tests```

**Benifits**
  * Allows testing without config setting that break tests
  * Simpler than creating a testing module

## Stateful Services with Repeated Controllers
It was brought to my attention that stateful services are sometimes considered by some to be an anti-pattern in Angular and one of the main complaints is that Angular services are singletons and the claim is that this makes it difficult to have controllers that are repeated on a page have their state stored in a service as each controller instance needs it's own copy of the data but if the state is in a service you get only one copy of the data. However, this is not a problem at all because an application can only have one state at any moment in time so there is no problem having one service instance matain the applicaitons model. The solution to this is quite simple and just requires you to organize your code a bit. If you have repeated content in Angular then the state for that repeated content can very easily be managed in a service at a higher scope and when you think about it, that repeated content will be generated by a service in a higher scope so it can easily be managed completely in the higher scope.

Let's coddify this idea with an example. To demonstrate this technique I have updated the application so that now the album list has a button that allows for getting a preview of the photo's in the album as shown below.

![albumsdemo](https://cloud.githubusercontent.com/assets/10080111/14404928/3d52f25e-fe48-11e5-9df5-8ea7e17e1403.gif)

Here each album is being repeated on as shown below and uses it's own controller.

```html
<h3 ng-show="blogVm.model.albums.length">Albums</h3>
<div class="row" ng-repeat="album in blogVm.model.albums">
  <div class="col-lg-12" ng-controller="AlbumController as albumVm">
    <div class="row">
      <div class="col-sm-6 col-md-4">
        <div class="thumbnail">
          <img ng-if="album.photos" ng-src="{{album.photos[0].thumbnailUrl}}">
          <div class="caption">
            <h3><span ng-bind="album.title"></span></h3>
            <a class="btn btn-primary" role="button" ng-click="albumVm.showPreview(album.id)">Preview</a> 
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

Now let's see how this is wired up. First thing is that ```blogVm.model.albums``` is being populated from our blog service which owns the resposbility for updating the state of our blog. The blog service has the model shown below.

```javascript
  function blog($http, users, posts, albums, $q, photos) {
    var service = {
      model: {
        userName: "",
        posts: [],
        albums: [],
        isBusy: false,
        error: null,
        selectedTab: "albums.html"
      },
      search: search,
      show: show,
      getPhotos: getPhotos
    }
```

As you can see the albums are on the blog service's model and they are being two way bound in the albums mark up above as shown here ```<div class="row" ng-repeat="album in blogVm.model.albums">```. So if we update the albums in the blog service then that update will propogate down to our repeated markup and cause the ablum instance to update in that AlbumController instance's scope. Now we simply expose a method on our blog service to update the album by adding it's photos as shown below.

```javascript
    function getPhotos(ablumId) {
      service.model.isBusy = true;
      service.model.error = null;

      photos.getPhotos(ablumId)
        .then(updatePhotos)
        .catch(handleError);
    }

    function updatePhotos(response) {
      for(var i=0;i<service.model.albums.length;i++) {
        if(service.model.albums[i].id === response.data[0].albumId) {
          service.model.albums[i].photos = response.data;
          break;
        }
      }

      service.model.isBusy = false;
    }
```

Then in our ```AlbumController``` we bind ```this.showPreview(album)``` to the ```blog.getPhotos(albumId)``` method and pass in the album ID we want to fetch photos for as shown below.

```javascript
  function AlbumController(blog) {
    this.showPreview = blog.getPhotos;
  }
```

And wire it up like below.

```html
<a class="btn btn-primary" role="button" ng-click="albumVm.showPreview(album.id)">Preview</a> 
```

So now when a user clicks preview we will get sequence shown below

![image](https://cloud.githubusercontent.com/assets/10080111/14405157/e72b47a4-fe4d-11e5-81f4-44e2cff77c52.png)

Our code is still very easy to reason about and allows for simple clean promise handling and there's no problem with having the model be owned by a service. Note that there are a lot of ways you could do this pattern. You could have a seperate javascript class for your model that you new up in your service if you like and you could also spread out your business\domain logic so that your domain service doesn't get too much code in it. You could break your service logic into more domain services or go with a command pattern like what is found in CQS or in Redux's reducer approach. There's a lot of options but I find that having the services own the model makes code cleaner and easier to reason about, promises simpler and testing easier.



**Branches**
* stateful-services-repeat 
 ```git checkout stateful-services-repeat```

 Note: I moved the code into an app folder for this branch so you will have to run ```http-server``` from the app folder.

**Benifits**
  * Allows using stateful services in repeated controllers