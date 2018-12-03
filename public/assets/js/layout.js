/// <reference path="typings/jquery.d.ts" />
var Navigation = /** @class */ (function () {
    function Navigation() {
        this.navItem = $('.side-navigation li');
        this.categoryItem = $('.category-navigation li');
        this.activeItem(this.navItem);
        this.activeItem(this.categoryItem);
    }
    Navigation.prototype.activeItem = function (elem) {
        var _this = this;
        elem.click(function (event) {
            event.preventDefault();
            elem.removeClass("active");
            $(event.currentTarget).addClass("active");
            var url = $('a', $(event.currentTarget)).attr("data-url");
            _this.fireAjax(url);
        });
    };
    Navigation.prototype.fireAjax = function (url) {
        var _this = this;
        var main = $('.wrapper');
        $.ajax({
            url: url,
            type: "GET",
            beforeSend: function () {
                _this.startLoader();
            },
            success: function () {
                setTimeout(function () {
                    _this.destroyLoader();
                }, 5000);
            }
        });
    };
    Navigation.prototype.startLoader = function () {
        $('.wrapper').addClass("loading").append('<div class="loader"></div>');
    };
    Navigation.prototype.destroyLoader = function () {
        $('.wrapper').removeClass("loading");
        $('.spinner').remove();
    };
    return Navigation;
}());
var Tabs = /** @class */ (function () {
    function Tabs() {
        this.tab = $('.card .tabs li');
        this.changeTab();
    }
    Tabs.prototype.changeTab = function () {
        this.tab.click(function (event) {
            var tab = $(event.currentTarget);
            var tabId = tab.attr("data-tab");
            tab.addClass("active");
            tab.siblings().removeClass("active");
            $('.card .content[data-content=' + tabId + ']').siblings().removeClass("visible");
            $('.card .content[data-content=' + tabId + ']').addClass("visible");
        });
    };
    return Tabs;
}());
var Collapse = /** @class */ (function () {
    function Collapse() {
        this.collapse();
    }
    Collapse.prototype.collapse = function () {
        $('.hidden-content').slideUp("fast");
        $('.show-more').click(function (event) {
            var target = $(event.currentTarget), less = target.attr("data-less"), more = target.attr("data-more");
            if (target.hasClass("active")) {
                target.removeClass("active");
                $('span', target).text(more);
                $('.fa', target).removeClass().addClass("fa fa-chevron-down");
                target.prev('.hidden-content').slideUp(250);
            }
            else {
                target.addClass("active");
                $('span', target).text(less);
                $('.fa', target).removeClass().addClass("fa fa-chevron-up");
                target.prev('.hidden-content').slideDown(250);
            }
        });
    };
    return Collapse;
}());
var Graphs = /** @class */ (function () {
    function Graphs() {
        this.graph = $('.graph');
        this.setGraphValue();
    }
    Graphs.prototype.setGraphValue = function () {
        this.graph.each(function (i, element) {
            var graph = $(element),
                // margin to correct the card graphs when there is a 100% value
                margin = graph.parents('.experience-graphs').length ? 0 : 13, bar = $('.bar', graph), barText = graph.attr("data-text"), value = $('.value', graph), parentHeight = graph.parent().innerHeight() - margin, barValue = parseInt(graph.attr("data-value")), barHeight = parentHeight * (barValue / 100);
            bar.text(barText);
            value.css({
                height: barHeight + "px"
            });
            bar.css({
                bottom: (barHeight - 1) + "px"
            });
        });
    };
    return Graphs;
}());
var LineChart = /** @class */ (function () {
    function LineChart() {
    }
    LineChart.prototype.initChart = function () {
        var ctx = $("#lineChart");
        var myLineChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: options
        });
    };
    return LineChart;
}());
new Navigation();
new Tabs();
new Collapse();
new Graphs();
new LineChart();
