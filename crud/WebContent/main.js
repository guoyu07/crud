 function showBatchWork(keyword){
    	window.clearInterval(inter);
		$("#main").load("remote/batch.jsp",{"tb":"room","keyword":keyword});
    }
 function doBatchWork(frm){
	 window.clearInterval(inter);
		var data=$(frm).serialize();
		
		$("#main").load("remote/batch.jsp#"+Math.random(),data);
		return false;
	}
	
 function viewroom(roomid){
 	window.clearInterval(inter);
		$("#main").load("view.jsp",{"tb":"room","id":roomid},reformatview);
 }
	function dbid(evt){
		var data=$(evt.target).parent().parent().attr("id");
		return parseInt(data);
	}
	function view(rowid){
		window.clearTimeout(inter);
		var tbname=$("#tbname").val();
		$("#main").load("view.jsp",{"tb":tbname,"id":rowid},reformatview);
		
		//window.open("view.jsp?tb="+tbname+"&id="+rowid);
	}
	function edit(rowid){
		window.clearTimeout(inter);
		var tbname=$("#tbname").val();
		$("#main").load("add.jsp",{"tb":tbname,"id":rowid},reformatform);
	}
	
	function report_row_del(tbname,rowid){
		var ans=confirm('确定删除编号'+rowid);
		if(ans){
			$.post("del.jsp",{"tbname":tbname,"id":rowid},new function(){
				 window.setTimeout("$('#main').load('report.jsp?page=0')",1000);
			});
		}
	}
	function del(rowid){
		var ans=confirm('确定删除编号'+rowid);
		var tbname=$("#tbname").val();
		if(ans){
			$.post("del.jsp",{"tbname":tbname,"id":rowid},new function(){
				 window.setTimeout("mainLoad('"+tbname+"')",1000);
			});
		}
	}
	
	function addButton(main){
		//$("#main tr :last-child").css("background","#eeeeee");
		var buttons="<td>"+
		"<span class='glyphicon glyphicon-eye-open'></span>"+
		"<span class='glyphicon glyphicon-edit'></span>"
								+"<span class='glyphicon glyphicon-trash' ></span>";
		
		buttons+="</td>";
		
		$("#main tr").append(buttons);
		$(".glyphicon-eye-open").bind("click",function(evt){
			view(dbid(evt));
		});
		$(".glyphicon-trash").bind("click",function(evt){
			del(dbid(evt));
		});
		$(".glyphicon-edit").bind("click",function(evt){
			edit(dbid(evt));
		});
		$(".glyphicon-refresh").bind("click",function(evt){
			goodsPriceSync(dbid(evt));
		});
		
		
	}
	function filteNext(preSelect){
		console.log("pre:",preSelect.name,preSelect.value);
		var tr=$(preSelect).parent().parent();
		var nextSelect=tr.next().children().last().children().last();
		if(nextSelect!=null&&nextSelect[0].tagName=="SELECT"){
			var keyword=preSelect.name;
			var keyvalue=preSelect.value;
			console.log("reload:",keyword,keyvalue);
		    loadSelect(nextSelect,"keyword="+keyword+"&keyvalue="+keyvalue);
		}
	}
	function loadSelect(input,append){
		var input_name=input.attr("name");
		var default_value=input.val();
		if(input[0].nodeName=="SPAN")  //view use span for tag, text() for value
			 	default_value=input.text();
		var tbname=input_name.substring(0,input_name.length-3);
		if(input.attr("fr")!=undefined) tbname=input.attr("fr");;
		var td=input.parent();
		td.load("select.jsp?tbname="+tbname+"&input_name="+input_name+"&value="+default_value+"&"+append);
		
	}
	function loadFile(input){
		var input_name=input.attr("name");
		var default_value=input.val();
		if(input[0].nodeName=="SPAN")  //view use span for tag, text() for value
			 	default_value=input.text();
		var td=input.parent();
		input[0].id=input_name;
		input[0].type="hidden";

		var html=$(td).html()+"<iframe width='50%' height='40px' scrolling='no' src='upload.jsp?input_name="+input_name+"'></iframe>";

		$(td).html(html);
		
	}
	function reformatform(){
		$("input[name$=_file]").each(function(){
			loadFile($(this));
		});
		$("input[name$=_id]").each(function(){
				loadSelect($(this));
		});
		$("input[postLoad=1]").each(function(){
			loadSelect($(this));
		});
		$(".input_date").datepicker();
		$(".input_datetime").datetimepicker(
				{   showSecond: false,
		            timeFormat: 'hh:mm:ss',
		            stepHour: 1,
		            stepMinute: 1,
		            stepSecond: 1
		        });
		if(tableName!='config')
				$("textarea").ckeditor();
		$("span[class='modifiable']").each(function(){
			var tbname=$(this).attr("tb");
			if(tbname==tableName||lastLoad.indexOf("report")!=-1){
				var fdname=$(this).attr("fd");
				var rid=$(this).attr("rid");
				$(this)[0].title="双击修改";
				$(this).dblclick(function(){
					var newValue=prompt("手工修改",$(this).text());
					if(newValue!=null&&newValue!=$(this).text()){
						//alert("update "+tbname+" set "+fdname+"="+newValue+" where id="+rid);
						
						$.post("callStatic.jsp",{"c":"com.newsclan.crud.Tools","m":"update",
							"tbname":tbname,
							"fdname":fdname,
							"value":newValue,
							"id":rid
								
								},new function(){
							 window.setTimeout("refresh();",500);
						});
						
					}
				});
			}
		});
	}
	function reformatview(){
		$("span[name$=_id]").each(function(){
			loadSelect($(this));
		});
	}
	
	function loadImport(){
		window.clearInterval(inter);
		$("#main").load("import.jsp?"+Math.random(),{},reformatform);
	}
	
	function loadReport(){
		window.clearInterval(inter);
		$("#main").load("report_select.jsp?"+Math.random(),{},reformatform);
	}
	
	function passChange(){ 
		window.clearInterval(inter);
		$("#main").load("passChange.jsp?"+Math.random());
	}
	function checkIfPasswordIsSame(frm){
		if($("#password").val()!=$("#password2").val()){
			alert("两次密码不一致");
			return false;
		}
		return true;
	}
	function mainLoad(tbname,pageNum,keyword){
		tableName=tbname; 
		if (typeof(pageNum)=='undefined') pageNum=thepage;
		if (typeof(keyword)=='undefined'||keyword=="") keyword=searchKeyword;
		thepage=pageNum;
		searchKeyword=keyword;
		window.clearInterval(inter);
		$("#main").load("list.jsp",{"tb":tbname,"pageNum":pageNum,"keyword":keyword},function(text,status,http){
			
			if(status=="success"){
				addButton($("#main"));
				reformatform();
				$("#tbname").after("<span id='addrow' class='glyphicon glyphicon-plus'></span>");
				$("#addrow").click(function(){
					$("#main").load("add.jsp",{tb:tbname},reformatform);
				});
				if($("#auto")[0].checked){
					autoRefresh();
				}
			}
		});
		lastLoad="mainLoad('"+tbname+"',"+pageNum+",'"+keyword+"');";
		
	}
	function reportPage(page){
		$('#main').load('report.jsp?page='+page);
		lastLoad="reportPage("+page+");";
	}
	function pageUp(tbname,pageNum){
		mainLoad(tbname,pageNum-1,searchKeyword);
	}
	function pageDown(tbname,pageNum){
		mainLoad(tbname,pageNum+1,searchKeyword);
	}
	function showReport(frm){
		var data=$(frm).serialize();
		$("#main").load("report_select.jsp?"+Math.random(),data,reformatform);
		lastLoad="reportPage(0);";
		return false;
	}
	
	function submitAdd(tbname){
		var data=$("#addForm").serialize();
		$.post("add.jsp",data,new function(){
			 mainLoad(tbname,0,searchKeyword);
		});
	}
	function submitTable(){
		var data=$("#frmAddTable").serialize();
		var tbname=$("#tb_name").val();
		
		$.post("addTable.jsp",data,new function(){
			 window.setTimeout("mainLoad('"+tbname+"',0,'"+searchKeyword+"')",1000);
		});
	}
	function addTable(){
		$("#main").empty();
		$("#main").append("<form method=post onSubmit='submitTable()' id='frmAddTable'><table id='tb_adding' class='table table-striped table-hover'></table></form>");
		$("#tb_adding").append("<tr><td>表名<input type=text id=tb_name name=tb_name value='tb_'></td><td>中文<input type=text name=tb_title value='信息'></td></tr>");
		$("#tb_adding").append("<tr><td>列名</td><td>类型</td><td>中文</td><td><a href=# onclick='addColumn();'><span class='glyphicon glyphicon-plus'></span></a></td></tr>");
		$("#frmAddTable").append("<input type=button onclick='submitTable()' value='确定'><input type=reset value='重置'>");
		addColumn();
		
	}
	function addColumn(){
		var row="<tr>";
		row+="<td><input name=fd_name type=text></td>";
		row+="<td><input name=fd_type type=text value='varchar(32)'></td>";
		row+="<td><input name=fd_title type=text></td>";
		row+="</tr>";
		$("#tb_adding").append(row);
	}
	function search(keyword){
		window.clearTimeout(inter);
		searchKeyword=keyword;
		inter=window.setTimeout("mainLoad(tableName,0,'"+keyword+"');",500);
	}
	function reload(){
		$("#main").empty();
		$("#main").append("<span class='glyphicon glyphicon-refresh' ></span>");
		window.setTimeout("mainLoad('"+tableName+"',0);",500);
		alert("reload");
	}
	function refresh(){
		eval(lastLoad);
	}
	function autoRefresh(){
		window.clearTimeout(inter);
		inter=window.setTimeout('refresh()',5000);
	}
	var inter=null;
	//var stid=null;
	var tableName="datadic";
	var searchKeyword="";
	var thepage=0;
	var lastLoad="";
