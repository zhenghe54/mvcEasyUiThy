(function (root) {
    "use strict";

    var defineModule;
    var module;

    (function () {
        var moduleMap = {};
        var moduleFactoryMap = {};

        defineModule = function (name, factory) {
            if (!moduleFactoryMap[name]) {
                moduleFactoryMap[name] = factory;
            }
            return moduleFactoryMap[name];
        }

        module = function (name) {
            if (!moduleMap[name]) {
                moduleMap[name] = moduleFactoryMap[name]();
            }
            return moduleMap[name];
        }
    })();


    /**
     * ====================================================================================
     * hmiview核心
     */
    defineModule('hmiview', function () {
        var hmiview = { //本Js文件唯一对外公开的接口
            version: '0.1.0',
            init: function (canvas) {
                var view = new HmiView(canvas);
                return view;
            }
        };
        //入口
        var util = module('util');
        var renderReg = module('renderReg');
        var Element = module('Element');
        var Page = module('Page');
        var Timer = module('Timer');
        renderReg.regRoundRect();
        var elemClassMap = {
            'Label': module('Label'),
            'RichLabel': module('RichLabel'),
            'RectPanel': module('RectPanel'),
            'CirclePanel': module('CirclePanel'),
            'WebCommonPanel': module('WebCommonPanel'),
            'Image': module('Image'),
            'RotateImage': module('RotateImage'),
            'ImgStatus': module('ImgStatus'),
            'Therm': module('Therm'),
            'SectorDial': module('SectorDial'),
            'ShapeStatus': module('ShapeStatus')
        };

        var HmiView = function (canvas) {
            var $this = this;
            var renderLoop = function () {
                $this.refresh();
            };
            this.canvas = canvas[0];
            this.page = new Page({
                ctx: this.canvas.getContext('2d')
            });
            this.elems = {};
            Timer.registerTimer(renderLoop, 50); //此处暂时写死，最少50毫秒刷新一次页面
        };

        HmiView.prototype = {
            //刷新，重新绘制
            refresh: function () {
                if (!this.page.resLoaded) return;  // 判断图片加载是否全部完成
                var ctx = this.page.ctx;
/*                ctx.setTransform(1, 0, 0,1, 0, 0);
                ctx.clearRect(0,0, this.canvas.width, this.canvas.height);*/
                this.canvas.width=this.canvas.width;
                if (this.backColor != 0) {
                    ctx.fillStyle = this.backColor;
                    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                }
                ctx.setTransform(this.page.scaleRate, 0, 0, this.page.scaleRate, 0, 0); //整体缩放
                if (this.backUrl != undefined && this.backUrl >= 0) {
                    var img = this.page.res[this.backUrl];
                    if (img) {
                        ctx.drawImage(img, 0, 0, this.page.originalWidth, this.page.originalHeight);
                    }
                }
                for (var i in this.elems) {
                    for (var j in this.elems[i]) {
                        this.elems[i][j].draw();
                    }
                }
            },

            // 更新数据
            updateData: function (data) {
                for (var tag in data) {
                    if (tag in this.elems) {
                        for (var i in this.elems[tag]) {
                            this.elems[tag][i].value = data[tag];
                        }
                    }
                }
            },

            // 选项
            setOptions: function (opts) {
                this.backUrl = opts.backUrl;
                this.backColor = util.getColor(opts.backColor);

                //配置每个元素
                for (var i in opts.elems) {
                    var elemPara = opts.elems[i];
                    if (elemPara.type in elemClassMap) {
                        var elem = new elemClassMap[elemPara.type];
                        elem.page = this.page;
                        elem.setProperties(elemPara);
                        var tagBinding = elem.tagName ? elem.tagName : elem.name;
                        this.elems[tagBinding] || (this.elems[tagBinding] = []);
                        this.elems[tagBinding].push(elem);
                    }
                }
                this.page.originalWidth = opts.originalSize[0];
                this.page.originalHeight = opts.originalSize[1];
                this.page.resUrls = opts.res;
                this.page.putRes(opts.loading, opts.loadSuc);
            },

            // 改变大小，自适应
            resize: function (width, height) {
                this.canvas.width = width;
                this.canvas.height = height;
                var rateX = width / this.page.originalWidth;
                var rateY = height / this.page.originalHeight;
                this.page.scaleRate = Math.min(rateX, rateY);
                this.refresh();
            }
        };
        return hmiview;
    });
    /**
     * ====================================================================================
     * Element
     */
    defineModule('Element', function () {
        var util = module('util');
        var Element = function () {
            this.name = '[NULL]';
        };

        Element.prototype = {
            setProperties: function (elemPara) {
                this.value = NaN;
                this.x = elemPara.location[0];
                this.y = elemPara.location[1];
                this.width= elemPara.size[0];
                this.height=elemPara.size[1];
                for (var i in elemPara) {
                    this[i] = elemPara[i];
                }
                delete this.location; //删除location和size属性，用x,y,width,height代替
                delete this.size;
                this.foreColor = util.getColor(this.foreColor);
                this.backColor = util.getColor(this.backColor);
                this.font = util.getFont(this.font);
            }
        };
        return Element;
    });


    /**
     * ====================================================================================
     * Timer，定时器
     */
    defineModule('Timer', function () {

        var requestNextAnimFrame = (function () { //考虑浏览器兼容性，动画帧
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })();

        var Action = function () {
            this.name = "";
            this.interval = 1000;
            this.lastAct = new Date();
            this.act = function () {
            };
        };

        Action.prototype = {
            doAct: function () {
                var now = new Date();
                if (now - this.lastAct > this.interval) {
                    this.act();
                    this.lastAct = new Date();
                }
            }
        };

        var globalActions = [];

        var loop = function () {
            for (var i in globalActions) {
                var action = globalActions[i];
                action && action.doAct();
            }
            requestNextAnimFrame(loop);
        };

        loop(); //执行循环

        function registerTimer(fun, interval) {
            var action = new Action();
            action.act = fun;
            action.interval = interval;
            globalActions.push(action);
        }

        return {
            registerTimer: registerTimer
        }

    });


    /**
     * ====================================================================================
     * Page
     */
    defineModule('Page', function () {
        var Page = function (opts) {
            this.ctx = opts.ctx;
            this.width = opts.width;
            this.height = opts.height;
            this.scaleRate = 1.0;
            this.resUrls = [];
            this.res = [];
            this.resLoaded = false;
        };

        Page.prototype = {
            putRes: function (loading, success) {
                var total = this.resUrls.length;
                var current = 1;
                var $this = this;
                if (total == 0) {
                    this.resLoaded = true;
                    success && success();
                }
                for (var i in this.resUrls) {
                    var img = new Image();
                    img.src = this.resUrls[i];
                    this.res[i] = img;
                    img.onload = function (e) {
                        loading && loading(current, total);
                        if (current == total) {
                            success && success();
                            $this.resLoaded = true;
                        }
                        current++;
                    };
                }
            }
        }
        return Page;
    });


    /**
     * ====================================================================================
     * util，通用工具
     */
    defineModule('util', function () {
        //从Element类继承一个新类
        function inheritElement(f) {
            var Element = module('Element');
            f.prototype = new Element();
        }

        //生成Canvas格式的颜色字符串
        function getColor(color) {
            if (color == 0) {
                return 0;
            } else {
                return 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
            }
        }

        //生成Canvas格式的字体字符串
        function getFont(font) {
            if (font[2] == 1) {
                return 'bold ' + (font[1] * 4 / 3) + 'px ' + font[0];
            } else {
                return font[1] + 'px ' + font[0];
            }
        }

        //以特定格式将数字转化为字符串
        function formatValue(value, format) {
            var n = 0;
            var value = parseFloat(value);
            var format = format ? format : "0";
            var dotIndex = format.indexOf('.');
            if (dotIndex >= 0) {
                n = format.length - dotIndex - 1;
            }
            return value.toFixed(n);
        }

        //暂未使用
        function defaults(target, source, overlay) {
            for (var key in source) {
                if (source.hasOwnProperty(key) && (overlay ? source[key] != null : target[key] == null)) {
                    target[key] = source[key];
                }
            }
            return target;
        }

        //暂未使用
        function mixin(target, source, overlay) {
            target = 'prototype' in target ? target.prototype : target;
            source = 'prototype' in source ? source.prototype : source;
            defaults(target, source, overlay);
        }

        return{
            inheritElement: inheritElement,
            getColor: getColor,
            getFont: getFont,
            formatValue: formatValue,
            mixin: mixin
        };
    });


    /**
     * ====================================================================================
     * renderReg
     */
    defineModule('renderReg', function () {
        function regRoundRect() {
            CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
                if (w < 2 * r) {
                    r = w / 2;
                }
                if (h < 2 * r) {
                    r = h / 2;
                }
                this.beginPath();
                this.moveTo(x + r, y);
                this.arcTo(x + w, y, x + w, y + h, r);
                this.arcTo(x + w, y + h, x, y + h, r);
                this.arcTo(x, y + h, x, y, r);
                this.arcTo(x, y, x + w, y, r);
                this.closePath();
                return this;
            }
        }

        return {
            regRoundRect: regRoundRect
        };
    });


    /**
     * ====================================================================================
     * Label
     */
    defineModule('Label', function () {
        var util = module('util');
        var Label = function () {
        }
        util.inheritElement(Label);
        Label.prototype = $.extend(Label.prototype, {
            draw: function () {
                var ctx = this.page.ctx;
                var align = this.align===null?1:this.align;
                var verticalAlign = this.verticalAlign===null?1:this.verticalAlign;
                var x = this.x;
                var y = this.y;
                var width = this.width;
                var height = this.height;
                var value = this.value;
                var text  = this.text;
                var format = this.format;
                ctx.save();
                if (this.backColor != 0){
                    ctx.fillStyle = this.backColor;
                    if (this.cornerRadius) {
                        ctx.roundRect(this.x, this.y, this.width, this.height, this.cornerRadius)
                        ctx.fill();
                    }else{
                        ctx.rect(this.x, this.y, this.width, this.height);
                        ctx.fill();
                    }
                }
                var show;
                if(typeof value == "boolean"||isNaN(value)||value==undefined){
                    show = text;
                }else{
                    if(this.format){
                        show = util.formatValue(value, this.format);
                    }
                }
                ctx.beginPath();
                ctx.fillStyle = this.foreColor;
                switch (align) {
                    case 0:
                        align = "left";
                        break;
                    case 1:
                        align = "center";
                        x = this.x + this.width / 2;
                        break;
                    case 2:
                        align = "right";
                        x = this.x + this.width;
                        break;
                }
                ctx.textAlign = align;
                switch (verticalAlign) {
                    case 0:
                        verticalAlign = "top";
                        break;
                    case 1:
                        verticalAlign = "middle";
                        y = this.y + this.height / 2;
                        break;
                    case 2:
                        verticalAlign = "bottom";
                        y = this.y + this.height;
                        break;
                }
                ctx.textBaseline = verticalAlign;
                ctx.font = this.font;
                ctx.fillText(show, x, y);
                ctx.restore();
            }
        });
        return Label;
    });


    /**
     * ====================================================================================
     * RichLabel
     */
    defineModule('RichLabel', function () {
        var util = module('util');
        var RichLabel = function () {
        }
        util.inheritElement(RichLabel);
        RichLabel.prototype = $.extend(RichLabel.prototype, {
            draw: function () {
                var ctx = this.page.ctx;
                var x = this.x;
                var y = this.y;
                var width = this.width;
                var height = this.height;
                var cornerRadius = this.cornerRadius;
                var backColor = this.backColor;
                var foreColor = this.foreColor;
                var lineColor = util.getColor(this.lineColor);
                var borderWidth = this.borderWidth;
                var font = this.font;
                var format = this.format;
                var align = this.align;
                var verticalAlign = this.verticalAlign;
                var text = this.value === undefined ? this.text : util.formatValue(this.value, format);
                var x1 = x;
                var y1 = y;
                ctx.save();
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = borderWidth;
                if (backColor != 0) {
                    ctx.fillStyle = backColor;
                    ctx.roundRect(x + borderWidth / 2, y + borderWidth / 2, width - borderWidth, height - borderWidth, cornerRadius).fill();
                }
                borderWidth && ctx.roundRect(x + borderWidth / 2, y + borderWidth / 2, width - borderWidth, height - borderWidth, cornerRadius).stroke();
                ctx.fillStyle = this.foreColor;
                ctx.font = font;
                switch (align) {
                    case 0:
                        align = "left";
                        break;
                    case 1:
                        align = "center";
                        x1 = this.x + this.width / 2;
                        break;
                    case 2:
                        align = "right";
                        x1 = this.x + this.width;
                        break;
                }
                ctx.textAlign = align;

                switch (verticalAlign) {
                    case 0:
                        verticalAlign = "top";
                        break;
                    case 1:
                        verticalAlign = "middle";
                        y1 = this.y + this.height / 2;
                        break;
                    case 2:
                        verticalAlign = "bottom";
                        y1 = this.y + this.height;
                        break;
                }
                ctx.textBaseline = verticalAlign;
                ctx.fillText(text, x1, y1);
                ctx.restore();
            }
        });
        return RichLabel;
    });


    /**
     * ====================================================================================
     * RectPanel 矩形面板
     */
    defineModule('RectPanel', function () {
        var util = module('util');
        var RectPanel = function () {
        }
        util.inheritElement(RectPanel);
        RectPanel.prototype = $.extend(RectPanel.prototype, {
            draw: function () {
                var ctx = this.page.ctx;
                var x = this.x;
                var y = this.y;
                var width = this.width;
                var height = this.height;
                var cornerRadius = this.cornerRadius;
                var backColor = this.backColor;
                var foreColor = this.foreColor;
                var lineColor = util.getColor(this.lineColor);
                var borderWidth = this.borderWidth;
                ctx.save();
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = borderWidth;
                if (backColor != 0) {
                    ctx.fillStyle = backColor;
                    ctx.roundRect(x + borderWidth / 2, y + borderWidth / 2, width - borderWidth, height - borderWidth, cornerRadius).fill();
                }
                borderWidth && ctx.roundRect(x + borderWidth / 2, y + borderWidth / 2, width - borderWidth, height - borderWidth, cornerRadius).stroke();
                ctx.restore();
            }
        });
        return RectPanel;
    });


    /**
     * ====================================================================================
     * CirclePanel 圆形面板
     */
    defineModule('CirclePanel', function () {
        var util = module('util');
        var CirclePanel = function () {
        }
        util.inheritElement(CirclePanel);
        CirclePanel.prototype = $.extend(CirclePanel.prototype, {
            draw: function () {
                var ctx = this.page.ctx;
                var x = this.x;
                var y = this.y;
                var width = this.width;
                var height = this.height;
                var backColor = this.backColor;
                var foreColor = this.foreColor;
                var borderWidth = this.borderWidth;
                var lineColor = util.getColor(this.lineColor);
                var x1 = this.x + width / 2;
                var y1 = this.y + height / 2;
                var r = this.width / 2;
                ctx.save();
                if (backColor != 0) {
                    ctx.beginPath();
                    ctx.fillStyle = backColor;
                    ctx.arc(x1, y1, r, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.beginPath();
                if (borderWidth) {
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = borderWidth;
                    ctx.arc(x1, y1, r, 0, Math.PI * 2);
                    ctx.stroke();
                }
                ctx.restore();
            }
        });
        return CirclePanel;
    });


    /**
     * ====================================================================================
     * WebCommonPanel
     */
    defineModule('WebCommonPanel', function () {
        var util = module('util');
        var WebCommonPanel = function () {
        }
        util.inheritElement(WebCommonPanel);
        WebCommonPanel.prototype = $.extend(WebCommonPanel.prototype, {
            draw: function () {
                var ctx = this.page.ctx;
                ctx.save();
                var lineColor = util.getColor(this.lineColor);
                ctx.strokeStyle = lineColor;
                ctx.fillStyle = this.backColor;
                ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.fillStyle = lineColor;
                ctx.fillRect(this.x, this.y, this.width, this.titleHeight);
                ctx.strokeRect(this.x, this.y, this.width, this.height);
                ctx.font = this.font;
                ctx.fillStyle = this.foreColor;
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                ctx.fillText(this.text, this.x + this.width / 2, this.y + this.titleHeight / 2);
                ctx.restore();
            }
        });
        return WebCommonPanel;
    });


    /**
     * ====================================================================================
     * Image
     */
    defineModule('Image', function () {
        var util = module('util');
        var Timer = module('Timer');
        var Image = function () {
            this.ang = 0;
        }
        util.inheritElement(Image);
        Image.prototype = $.extend(Image.prototype, {
            draw: function () {
                var ctx = this.page.ctx;
                ctx.save();
                var img = this.page.res[this.imgUrl];
                ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
                ctx.rotate(this.ang);
                ctx.drawImage(img, -this.width / 2, -this.height / 2, this.width, this.height);
                ctx.restore();
            }
        });
        return Image;
    });


    /**
     * ====================================================================================
     * RotateImage
     */
    defineModule('RotateImage', function () {
        var util = module('util');
        var Timer = module('Timer');
        var RotateImage = function () {
            this.ang = 0;
        }
        util.inheritElement(RotateImage);
        RotateImage.prototype = $.extend(RotateImage.prototype, {
            draw: function () {
                var ctx = this.page.ctx;
                ctx.save();
                var img = this.page.res[this.imgUrl];
                ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
                ctx.rotate(this.ang);
                this.ang += 0.05; //此处暂时写死，未来应该根据实际速度进行计算
                ctx.drawImage(img, -this.width / 2, -this.height / 2, this.width, this.height);
                ctx.restore();
            }
        });
        return RotateImage;
    });


    /**
     * ====================================================================================
     * ImgStatus 开关
     */
    defineModule('ImgStatus', function () {
        var util = module('util');
        var ImgStatus = function () {
        }
        util.inheritElement(ImgStatus);
        ImgStatus.prototype = $.extend(ImgStatus.prototype, {
            draw: function () {
                var ctx = this.page.ctx;
                var text, textColor;
                ctx.save();
                var imgUrl = this.value ? this.onImgUrl : this.offImgUrl;
                ctx.drawImage(this.page.res[imgUrl], this.x, this.y, this.width, this.height);
                if (this.value) {
                    text = onText;
                    textColor = onTextColor;
                } else {
                    text = offText;
                    textColor = offTextColor;
                }
                if (text) {
                    ctx.fillStyle = textColor;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(text, x + width / 2, y + heigth / 2, width);
                }
                ctx.restore();
            }
        });
        return ImgStatus;
    });
    /**
     * ====================================================================================
     * ShapeStatus
     */
    defineModule('ShapeStatus', function () {
        var util = module('util');
        var ShapeStatus = function () {
        }
        util.inheritElement(ShapeStatus);
        ShapeStatus.prototype = $.extend(ShapeStatus.prototype, {
            draw: function () {
                var ctx = this.page.ctx;
                var x = this.x;
                var y = this.y;
                var width = this.width;
                var heigth = this.height;
                var shape = this.shape;
                var onColor = util.getColor(this.onColor);
                var offColor = util.getColor(this.offColor);
                var onText = this.onText;
                var offText = this.offText;
                var font = this.font;
                var onTextColor = util.getColor(this.onTextColor);
                var offTextColor = util.getColor(this.offTextColor);
                this.value = 1;
                ctx.save();
                ctx.fillStyle = this.value ? onColor : offColor;
                ctx.font = font;
                switch (shape) {
                    default:
                    case 0:
                        ctx.fillRect(x, y, width, heigth);
                        break;
                    case 1:
                        var x1 = x + width / 2;
                        var x2 = y + heigth / 2;
                        var r = Math.min(width, heigth) / 2;
                        ctx.beginPath();
                        ctx.arc(x1, x2, r, 0, Math.PI * 2);
                        ctx.fill()
                        break;
                }
                var text, textColor;
                if (this.value) {
                    text = onText;
                    textColor = onTextColor;
                } else {
                    text = offText;
                    textColor = offTextColor;
                }
                if (text) {
                    ctx.fillStyle = textColor;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(text, x + width / 2, y + heigth / 2, width);
                }
                ctx.restore();
            }
        });
        return ShapeStatus;
    });


    defineModule('Therm', function () {
        var util = module('util');
        var Therm = function () {
        };
        util.inheritElement(Therm);
        Therm.prototype = $.extend(Therm.prototype, {
            draw: function (value) {
                var ctx = this.page.ctx;
                var x = this.x;
                var y = this.y;
                var width = this.width;
                var height = this.height;
                var low = this.low;
                var high = this.high;
                var warnVal = this.warnVal;
                var interval = this.labelInterval;
                var step = this.step;
                var showLabel = this.showLabel;
                var value = this.value;
                var format = "0";
                ctx.save();
                var txtHeight = 20;
                var n = (high - low) / interval;
                var intervalHeight = (height - txtHeight) / n;
                var maxWidth = width / 2;
                var x1 = x + width / 2;
                var y1 = y + txtHeight;
                if (showLabel == true) {
                    ctx.beginPath();
                    ctx.fillStyle = "black";
                    for (var i = 0; i < n + 1; i++) {
                        if (i % step == 0) {
                            ctx.textAlign = "end";
                            ctx.fillText(high - i * interval, x1 - 4, y1 + 4 + i * intervalHeight, maxWidth);
                        }
                    }
                }
                ctx.beginPath();
                ctx.fillStyle = "black";
                ctx.textAlign = "center";
                ctx.baseline = "middle";
                ctx.fillText(util.formatValue(value,format), x1 + maxWidth / 2, y + txtHeight / 2, width / 2, maxWidth);
                ctx.beginPath();
                ctx.fillStyle = "green";
                ctx.fillRect(x1, y1 + ((height - txtHeight) - value / (high - low) * (height - txtHeight)), width / 2, value / (high - low) * (height - txtHeight));
                ctx.fill();
                ctx.beginPath();
                ctx.strokeStyle = "black";
                for (var i = 0; i < n + 1; i++) {
                    ctx.moveTo(x1, y1 + i * intervalHeight);
                    if (i % step == 0) {
                        ctx.lineTo(x1 + 5, y1 + i * intervalHeight);
                    } else {
                        ctx.lineTo(x1 + 3, y1 + i * intervalHeight);
                    }
                }
                ctx.stroke();
                ctx.beginPath();
                ctx.strokeRect(x1, y1, width / 2, (height - txtHeight));
                ctx.stroke();
                ctx.beginPath();
                ctx.strokeStyle = "red";
                ctx.moveTo(x1, y1 + ((height - txtHeight) - warnVal / (high - low) * (height - txtHeight)));
                ctx.lineTo(x1 + width / 2, y1 + ((height - txtHeight) - warnVal / (high - low) * (height - txtHeight)));
                ctx.stroke();
                ctx.restore();
            }
        });
        return Therm;
    });
    defineModule('HTherm', function () {
        var util = module('util');
        var HTherm = function () {
        };
        util.inheritElement(HTherm);
        HTherm.prototype = $.extend(HTherm.prototype, {
            draw: function (value) {
                var ctx = this.page.ctx;
                var x = this.x;
                var y = this.y;
                var width = this.width;
                var height = this.height;
                var low = this.low;
                var high = this.high;
                ctx.rect(x,y,width_inner,height);
                ctx.fillStyle = 'green';
                ctx.fill();
                ctx.rect(x,y,width,height);
                ctx.strokeStyle='black';
                ctx.beginPath();
                ctx.stroke();
                ctx.restore();
            }
        });
        return HTherm;
    });
    defineModule('SectorDial', function () {
        var util = module('util');
        var SectorDial = function () {
        }
        util.inheritElement(SectorDial);
        SectorDial.prototype = $.extend(SectorDial.prototype, {
            draw: function (value) {
                var ctx = this.page.ctx;
                var x = this.x;
                var y = this.y;
                var width = this.width;
                var height = this.height;
                var low = this.low;
                var high = this.high;
                var value = util.formatValue(this.value, this.format)
                var interval = this.interval;
                var step = this.step;
                var start_b = this.start_b;
                var start_c = this.start_c;
                var x1 = x + width / 2;
                var y1 = y + width / 2;
                var r = width / 2;
                var n = (high - low) / interval;
                ctx.save();
                ctx.translate(x1, y1);
                ctx.beginPath();
                ctx.arc(0, 0, r, Math.PI, 2 * Math.PI);
                ctx.lineTo(0, 0);
                ctx.rotate(0);
                ctx.lineTo(r, 0);
                ctx.fillStyle = "#057CB5"
                ctx.fill();
                ctx.rotate(-Math.PI / 2);
                for (var i = 0; i < n + 1; i++) {
                    if (i != 0) {
                        ctx.rotate(Math.PI / n);
                    }
                    ctx.beginPath();
                    ctx.strokeStyle = "#ffffff";
                    ctx.fillStyle = "#ffffff";
                    ctx.lineWidth = 2;
                    if (i % step == 0) {
                        ctx.moveTo(0, -r);
                        ctx.lineTo(0, -r + 10);
                        ctx.save();
                        ctx.textAlign = "center";
                        ctx.fillText(interval * i, 0, -r + 20, 40);
                        ctx.restore();
                    } else {
                        ctx.moveTo(0, -r);
                        ctx.lineTo(0, -r + 5);
                    }
                    ctx.stroke();
                }
                ctx.beginPath();
                ctx.rotate(-Math.PI / 2);
                ctx.lineWidth = 1 / 8 * r;
                var r1 = 5 / 8 * r;
                ctx.beginPath();
                ctx.strokeStyle = "green";
                ctx.arc(0, 0, r1, Math.PI, Math.PI + start_b / (high - low) * Math.PI);
                ctx.stroke();
                ctx.beginPath();
                ctx.strokeStyle = "yellow";
                ctx.arc(0, 0, r1, Math.PI + start_b / (high - low) * Math.PI, Math.PI + start_c / (high - low) * Math.PI);
                ctx.stroke();
                ctx.beginPath();
                ctx.strokeStyle = "red";
                ctx.arc(0, 0, r1, Math.PI + start_c / (high - low) * Math.PI, 2 * Math.PI);
                ctx.stroke();
                ctx.beginPath();
                ctx.fillStyle = "blue"
                ctx.fillRect(-r1 * 3 / 8, -r1 / 2, r1 * 3 / 4, r1 / 4)
                ctx.fill();
                ctx.fillStyle = "#ffffff"
                ctx.textAlign = "center"
                ctx.fillText(value, 0, -r1 * 5 / 16, r1 / 2);
                ctx.rotate(-Math.PI / 2);
                ctx.beginPath();
                ctx.strokeStyle = "gold"
                ctx.lineWidth = "2"
                ctx.moveTo(0, 0);
                ctx.rotate(value / (high - low) * Math.PI);
                ctx.lineTo(0, -r)
                ctx.stroke();
                ctx.beginPath();
                ctx.fillStyle = "gray";
                ctx.arc(0, 0, r1 / 8, 0, 2 * Math.PI);
                ctx.fill();
                ctx.restore();
            }
        });
        return SectorDial;
    });

    /**
     * ====================================================================================
     * DemoElem 示范
     */
    defineModule('DemoElem', function () {
        var util = module('util');
        var DemoElem = function () {
        } //声明DemeElem是一个类
        util.inheritElement(DemoElem); //声明DemeElem类继承自Element类（JavaScript中的伪继承）
        DemoElem.prototype = $.extend(DemoElem.prototype, { //此行继承基类，并实现扩展
            draw: function () {
                var ctx = this.page.ctx;
                ctx.save(); //通常都需要保存Context的状态，防止意外修改

                //在此处实现Canvas的绘制
                ctx.fillRect(this.x, this.y, 20, 20);
                //Canvas绘制结束

                ctx.restore(); //与ctx.save()配套
            }
        });
        return DemoElem;
    });


    root.hmiview = module('hmiview');


})(this);