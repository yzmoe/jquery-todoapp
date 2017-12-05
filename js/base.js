!function(){

  var $addTask=$('.add-task') //获取添加任务表单元素的jquery对象
  var $taskList=$('.task-list') //获取任务列表区域的jquery对象
  var $taskDetail=$('.task-detail') //获取任务详情的jquery对象
  var $taskMask=$('.task-detail-mask') //获取遮罩层的jquery对象
  var taskList=[];// 所有task的容器
  var current; //用于计数，当前打开任务详情的序号
  init();
  //初始化读取localstorage中tasklist
  function init(){
    taskList=store.get('taskList') || [];
    if(taskList.length!=0){
      renderTaskList()
    }
  }
  //更新任务列表区域
  function renderTaskList(){
    $taskList.html('')
    for (let i=0;i<taskList.length;i++){
      let $task=renderTaskItem(taskList[i],i);
      $taskList.append($task)
    }
  }
  //动态生成每个任务
  function renderTaskItem(data,idx){
    // 定义模板
    let tpl='<div class="task-item'+(data.complete?" task-item_completed":"")+'" data-index='+idx+'>'+
                      '<span><input type="checkbox"'+(data.complete?"checked":"")+'></span>'+
                      '<span class="task-content">'+data.content+'</span>'+
                      '<span class="action delete">删除</span>'+
                      '<span class="action detail">详细</span>'+
                    '</div>';
    return $(tpl)
  }



  //将输入内容添加至任务列表区域
  $addTask.on('submit',function(e){
    e.preventDefault();
    let newTask={} // 待存储新task对象
    let $input=$(this).find('input')
    newTask.content=$input.val() //获取输入的内容
    if(!newTask.content)return //如果没有输入结束执行此函数
    //添加成功，输入框清零
    if(addTask(newTask)){
      $input.val('')
    }
  })
  function addTask(newTask){
    // 将新task推入tasklist
    let i;
    let arr;
    for(i=0;i<taskList.length;i++){
      if(taskList[i].complete){
        break;
      }
    }
    arr=taskList.splice(i)
    taskList.push(newTask)
    taskList=taskList.concat(arr)
    renderTaskList()
    return true;
  }
  function refreshLoaclStorage(){
  }




  //监听任务中“删除”和“详情”按钮点击
  $taskList.on('click','.delete',function(){
    let $this=$(this)
    let $item=$this.parent();
    let idx=$item.data('index')
    let result=confirm('确定删除？')
    result?deleteTask(idx):null;
  }).on('click','.detail',function(){
    let $this=$(this)
    let $item=$this.parent();
    let idx=$item.data('index')
    let $date_time=$this.find('input')
    current=idx;
    show_task_detail(idx)
  }).on('dblclick','.task-item',function(){
    let $this=$(this)
    let idx=$this.data('index')
    current=idx;
    show_task_detail(idx)
  })
  function deleteTask(idx){
    // 删除数组中对应序号的项
    taskList.splice(idx,1)
    renderTaskList();
  }
  // 显示任务详情和遮罩层
  function show_task_detail(idx){
    render_task_detail(idx)
    $taskDetail.show();
    $taskMask.show();
  }
  // 动态生成任务详情模板
  function render_task_detail(idx){
    let item=taskList[idx]
    item.desc=item.desc||'';
    item.time=item.time||'';
    let tpl='<form>'+
            '<div class="content">'+
              item.content+
            '</div>'+
            '<div class="desc">'+
              '<textarea name="name">'+item.desc+'</textarea>'+
            '</div>'+
            '<div class="btn"><button type="submit">更新</button></div>'+
            '</form>'
    $taskDetail.html('');
    $taskDetail.html(tpl)
  }



  // 遮罩层隐藏
    $(window).on('keyup',function(e){
      if(e.keyCode==27){
        hide_tasks_detail();
      }
    })

  $taskMask.on('click',function(){
    hide_tasks_detail()
  })
  function hide_tasks_detail(){
    $taskDetail.hide();
    $taskMask.hide();
  }




  // 更新任务详情
  $taskDetail.on('submit','form',function(e){
    e.preventDefault();
    let $this=$(this)
    taskList[current].desc=$this.find('textarea').val();
    $taskDetail.hide();
    $taskMask.hide();
  })



  // 监听任务完成情况
  $taskList.on('click','[type=checkbox]',function(){
    let $this=$(this)
    let idx=$this.parents('.task-item').data('index')
    if(!taskList[idx].complete){
      taskList[idx].complete=true;
      refresh_task_list1(idx)
    }else{
      taskList[idx].complete=false;
      refresh_task_list2(idx);
    }

  })
  function refresh_task_list1(idx){
    let item=taskList.splice(idx,1)
    taskList=$.merge(taskList,item)
    renderTaskList()
  }
  function refresh_task_list2(idx){
    let item=taskList.splice(idx,1)
    let i
    let arr
    for(i=0;i<taskList.length;i++){
      if(taskList[i].complete){
        break;
      }
    }
    arr=taskList.splice(i)
    taskList=taskList.concat(item)
    taskList=taskList.concat(arr)
    renderTaskList()
  }
  // 页面关闭之前保存taskList到localstorage中
  $(window).on('beforeunload',function(){
    store.set('taskList',taskList)
  })

  }();
