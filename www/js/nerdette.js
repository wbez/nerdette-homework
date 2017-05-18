$( document ).ready(function() {
	
    var $items = $('#items');
    var $container = $('#items');
    // init
    $container.isotope({
      // options
      itemSelector: '.item',
      layoutMode: 'masonry',
    });

    $container.imagesLoaded().progress( function() {
      $container.isotope('layout');
    });

    // Handles filter based on main verb buttons
    $('button.verb').click(function(){

        var $parent = $(this).parent();
        var filters = [];
        var directory = '';
        $('button.verb').removeClass('active');
        $('button.verb').not(this).addClass('inactive')
        $(this).addClass("active");
        $(this).removeClass("inactive");
            
        $('.active').each(function(){
            var filter = $(this).attr('data-filter');
            console.log(filter)
            if ($.inArray(filter, filters)==-1) {
                filters.push($(this).attr('data-filter'));
            };
        });

        selector = filters.join(',');
        if (filters.length>0){
            directory = 'tag'   
        }

        hasher.setHash( directory, selector );
    });

    // Handles filter based on main verb buttons
    $('button.verb').click(function(){

        var $parent = $(this).parent();
        var filters = [];
        var directory = '';
        $('button.verb').removeClass('active');
        $('button.verb').not(this).addClass('inactive')
        $('.person').removeClass('active');
        $('.person').not(this).addClass('inactive')
        $(this).addClass("active");
        $(this).removeClass("inactive");
            
        $('.active').each(function(){
            var filter = $(this).attr('data-filter');
            console.log(filter)
            if ($.inArray(filter, filters)==-1) {
                filters.push($(this).attr('data-filter'));
            };
        });

        selector = filters.join(',');
        if (filters.length>0){
            directory = 'tag'   
        }

        hasher.setHash( directory, selector );
    });

    // Handles filter based on assigner
    $('.person').click(function(){

        var $parent = $(this).parent();
        var filters = [];
        var directory = '';

        $('.person').removeClass('active');
        $('.person').not(this).addClass('inactive')
        $('button.verb').removeClass('active');
        $('button.verb').not(this).addClass('inactive')

        $(this).addClass("active");
        $(this).removeClass("inactive");
            
        $('.active').each(function(){
            var filter = $(this).attr('data-filter');
            console.log(filter)
            if ($.inArray(filter, filters)==-1) {
                filters.push($(this).attr('data-filter'));
            };
        });

        selector = filters.join(',');
        if (filters.length>0){
            directory = 'tag'   
        }

        hasher.setHash( directory, selector );
        $('.collapse').collapse('hide')

    });

    // Shows assignment modal on item click
    $('.item').click(function(){

        selector = $(this).attr('id')
        directory = 'assignment'

        hasher.setHash( directory, selector );
    });

    $('.clear-filters').click(function(){
        $("button.verb,.verbs").removeClass("active inactive");
        hasher.setHash('_');
    });

    $('#myModal').on('hidden.bs.modal', function (e) {
        console.log("Previous was "+previous)
        
        if (previous == '') {
            previous = '_'
        }

        hasher.setHash(previous);
    })

    function handleChanges(newHash, oldHash){
        // remove any active tags
        $("button.verb,.verbs,.person").removeClass("active");
        
        // save previous oldHash globally for modal
        previous = oldHash;
        
        // get attributes from newHash
        var hashArray = hasher.getHashAsArray();
        var directory = hashArray[0];
        var tagString = hashArray[1];
        var tags = [];
        var tagsArray = [];
        
        // create tagsArray and tags class filters
        if (tagString){
            tagsArray = hashArray[1].split(',');
            for (var i in tagsArray) {
                tags[i] = '.'+tagsArray[i];
            };
            filter = tags.join('');
        };
            
        // parse directory and then filter as needed
        if (directory=='tag') {
            $('.active-filters').html('Filtering for: ');
            $("button.verb").addClass("inactive");
            for (var i in tagsArray) {
                var prettyTag = $( "button[data-filter='"+tagsArray[i]+"'],.person[data-filter='"+tagsArray[i]+"']" ).first().text()
                $( "button[data-filter='"+tagsArray[i]+"'],.person[data-filter='"+tagsArray[i]+"']" ).addClass("active");
                $( "button[data-filter='"+tagsArray[i]+"'],.person[data-filter='"+tagsArray[i]+"']" ).removeClass("inactive");
                $('.clear-filters').html('<i class="fa fa-times-circle"></i>');
                if (i==0) {
                    $('.active-filters').append('<span class="selected '+tagsArray[i]+'">'+prettyTag+'</span>');
                } else if (i == tagsArray.length-1 && tagsArray.length > 1){
                    $('.active-filters').append(" and " +prettyTag);
                } else {
                    $('.active-filters').append(", " +prettyTag);
                }
            };
            $items.isotope({ filter: filter });
        } else if (directory=='assignment') {
            console.log(tagString);
            var assignment = _.find(DATA, function(item){ return item['id'] == tagString; });

            console.log(assignment)
            $('.modal-body').empty();
            $('.modal-body').append(JST.modal_template(assignment));
            $('#myModal').modal('show');
        } else {
            $('.active-filters').html('No filters applied');
            $('.clear-filters').html('');
            $items.isotope({ filter: '*' });
        };

      }

    $container.isotope( 'on', 'arrangeComplete', function(filteredItems){
        $('#noresults').hide();
        if (filteredItems.length == 0) {
            $('#noresults').show();
        } else {
            $('#noresults').hide();
        }
    });

    var filters_offset = $('.filter-text').height();

    $('#filters').affix({
        offset: {
            top: $('.active-filters').offset().top-$('.filter-text').height()
        }
    });

    hasher.changed.add(handleChanges); //add hash change listener
    hasher.initialized.add(handleChanges); //add initialized listener (to grab initial value in case it is already set)
    hasher.init(); //initialize hasher (start listening for history changes)

    $("img").unveil(0,function(){
        $(this).load(function() {
            $container.isotope('layout');
        });
    });

    var test_id="watch-and-or-read-a-handmaid-s-tale"
    // console.log(_.find(ITEMS, function(item) {
    //     return item.TaskCategory.TaskCategoryId == $routeParams.TaskCategory; 
    // }));

});