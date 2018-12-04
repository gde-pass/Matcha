(function() {
    $("ul.menu li").click(function() {
        $("ul.menu li").removeClass('active');
        return $(this).addClass('active');
    });

}).call(this);
