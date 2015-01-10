// xyz-api.js
angular.module('xyz')
  .factory('xyzAPI', function($http){
    var backendHost = "https://frozen-chamber-6676.herokuapp.com/";
    return{
      getCollections:function(){
        return $http.get(backendHost + 'collections');
      },
      createCollection:function(params){
        return $http.post(backendHost + 'collections', params);
      },
      editCollection:function(id, name){
        return $http.put(backendHost + 'collections/' + id, {name: name} );
      },
      deleteCollection:function(id){
        return $http.delete(backendHost + 'collections/' + id);
      },
      likeMedia: function(id) {
        return $http.post(backendHost + "api/like", {mediaId: id});
      },
      addToCollection: function(id, postId){
        return $http.put(backendHost + "collection/"+id+"/post", {instagramId: postId});
      },
      viewCollection: function(id){
        return $http.get(backendHost + "collections/"+id)
      }
    };
  })