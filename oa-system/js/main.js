// OA系统主要JavaScript文件
class OASystem {
    constructor() {
        this.currentPage = 'dashboard';
        this.modal = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadPageData();
        this.initNotifications();
    }

    bindEvents() {
        // 侧边栏导航
        document.querySelectorAll('.sidebar-menu li').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.navigateToPage(page);
            });
        });

        // 快捷操作
        document.querySelectorAll('.action-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.navigateToPage(page);
            });
        });

        // 模态框
        this.initModal();

        // 用户信息下拉
        document.querySelector('.user-profile').addEventListener('click', () => {
            this.showUserMenu();
        });

        // 通知点击
        document.querySelector('.notifications').addEventListener('click', () => {
            this.showNotifications();
        });
    }

    navigateToPage(page) {
        // 更新侧边栏活动状态
        document.querySelectorAll('.sidebar-menu li').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // 隐藏所有页面
        document.querySelectorAll('.page').forEach(pageEl => {
            pageEl.classList.remove('active');
        });

        // 显示目标页面
        const targetPage = document.getElementById(page);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = page;
            
            // 更新面包屑
            this.updateBreadcrumb(page);
            
            // 加载页面特定数据
            this.loadPageData(page);
        }
    }

    updateBreadcrumb(page) {
        const pageNames = {
            'dashboard': '工作台',
            'organization': '组织架构',
            'members': '成员管理',
            'roles': '角色权限',
            'workflow': '工作流程',
            'tasks': '任务管理',
            'chat': '即时通讯',
            'documents': '文档中心',
            'announcements': '公告通知',
            'calendar': '日程安排',
            'reports': '数据报表'
        };

        document.getElementById('current-page').textContent = pageNames[page] || page;
    }

    loadPageData(page = this.currentPage) {
        switch (page) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'organization':
                this.loadOrganizationData();
                break;
            case 'members':
                this.loadMembersData();
                break;
            case 'roles':
                this.loadRolesData();
                break;
            default:
                console.log(`Loading data for page: ${page}`);
        }
    }

    loadDashboardData() {
        // 更新统计数据
        this.updateDashboardStats();
        
        // 更新最近活动
        this.updateRecentActivities();
    }

    updateDashboardStats() {
        // 模拟实时数据更新
        const stats = [
            { id: 'total-members', value: 156, change: '+2' },
            { id: 'pending-tasks', value: 23, change: '-5' },
            { id: 'pending-approvals', value: 8, change: '+1' },
            { id: 'efficiency', value: '95%', change: '+2%' }
        ];

        stats.forEach(stat => {
            const element = document.querySelector(`.stat-card:nth-child(${stats.indexOf(stat) + 1}) h3`);
            if (element) {
                element.textContent = stat.value;
            }
        });
    }

    updateRecentActivities() {
        const activities = [
            { icon: 'fas fa-file-alt', text: '李四提交了请假申请', time: '2分钟前' },
            { icon: 'fas fa-comment', text: '王五在项目讨论组发表了新消息', time: '5分钟前' },
            { icon: 'fas fa-check', text: '财务审批流程已完成', time: '10分钟前' },
            { icon: 'fas fa-user-plus', text: '新成员赵六已加入技术部', time: '15分钟前' }
        ];

        const activityList = document.querySelector('.activity-list');
        if (activityList) {
            activityList.innerHTML = activities.map(activity => `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="${activity.icon}"></i>
                    </div>
                    <div class="activity-content">
                        <p>${activity.text}</p>
                        <span class="time">${activity.time}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    initModal() {
        this.modal = document.getElementById('modal');
        const closeBtn = this.modal.querySelector('.close');
        
        closeBtn.addEventListener('click', () => {
            this.closeModal();
        });

        // 点击模态框外部关闭
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.closeModal();
            }
        });
    }

    showModal(title, content) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-body').innerHTML = content;
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    showUserMenu() {
        const menuContent = `
            <div class="user-menu">
                <div class="user-menu-item">
                    <i class="fas fa-user"></i>
                    <span>个人资料</span>
                </div>
                <div class="user-menu-item">
                    <i class="fas fa-cog"></i>
                    <span>系统设置</span>
                </div>
                <div class="user-menu-item">
                    <i class="fas fa-question-circle"></i>
                    <span>帮助中心</span>
                </div>
                <div class="user-menu-divider"></div>
                <div class="user-menu-item">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>退出登录</span>
                </div>
            </div>
        `;

        this.showModal('用户菜单', menuContent);
    }

    showNotifications() {
        const notifications = [
            { type: 'info', title: '系统通知', message: '系统将在今晚22:00进行维护升级', time: '10分钟前' },
            { type: 'warning', title: '任务提醒', message: '您有3个任务即将到期', time: '30分钟前' },
            { type: 'success', title: '审批完成', message: '您的请假申请已通过审批', time: '1小时前' }
        ];

        const content = `
            <div class="notifications-list">
                ${notifications.map(notification => `
                    <div class="notification-item ${notification.type}">
                        <div class="notification-icon">
                            <i class="fas fa-${this.getNotificationIcon(notification.type)}"></i>
                        </div>
                        <div class="notification-content">
                            <h4>${notification.title}</h4>
                            <p>${notification.message}</p>
                            <span class="time">${notification.time}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        this.showModal('通知中心', content);
    }

    getNotificationIcon(type) {
        const icons = {
            'info': 'info-circle',
            'warning': 'exclamation-triangle',
            'success': 'check-circle',
            'error': 'times-circle'
        };
        return icons[type] || 'bell';
    }

    // 工具函数
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(toast);

        // 显示动画
        setTimeout(() => toast.classList.add('show'), 100);

        // 自动隐藏
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }

    // 数据验证
    validateForm(formData) {
        const errors = [];
        
        Object.keys(formData).forEach(key => {
            if (!formData[key] || formData[key].trim() === '') {
                errors.push(`${key} 不能为空`);
            }
        });

        return errors;
    }

    // API调用模拟
    async apiCall(endpoint, method = 'GET', data = null) {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 模拟成功响应
        return {
            success: true,
            data: this.getMockData(endpoint),
            message: '操作成功'
        };
    }

    getMockData(endpoint) {
        const mockData = {
            '/api/members': this.getMockMembers(),
            '/api/departments': this.getMockDepartments(),
            '/api/stats': this.getMockStats()
        };
        
        return mockData[endpoint] || [];
    }

    getMockMembers() {
        return [
            { id: 1, name: '张三', department: '技术部', position: '高级工程师', email: 'zhangsan@company.com', phone: '13800138001', status: 'active' },
            { id: 2, name: '李四', department: '市场部', position: '市场经理', email: 'lisi@company.com', phone: '13800138002', status: 'active' },
            { id: 3, name: '王五', department: '财务部', position: '会计', email: 'wangwu@company.com', phone: '13800138003', status: 'active' },
            { id: 4, name: '赵六', department: '人事部', position: 'HR专员', email: 'zhaoliu@company.com', phone: '13800138004', status: 'inactive' }
        ];
    }

    getMockDepartments() {
        return [
            { id: 1, name: '技术部', manager: '张三', memberCount: 25, description: '负责产品研发和技术支持' },
            { id: 2, name: '市场部', manager: '李四', memberCount: 15, description: '负责市场推广和客户关系' },
            { id: 3, name: '财务部', manager: '王五', memberCount: 8, description: '负责财务管理和资金运作' },
            { id: 4, name: '人事部', manager: '赵六', memberCount: 6, description: '负责人力资源管理' }
        ];
    }

    getMockStats() {
        return {
            totalMembers: 156,
            activeMembers: 148,
            departments: 8,
            pendingTasks: 23,
            completedTasks: 156,
            efficiency: 95
        };
    }
}

// 页面加载完成后初始化系统
document.addEventListener('DOMContentLoaded', () => {
    window.oaSystem = new OASystem();
});

// 添加Toast样式
const toastStyles = `
<style>
.toast {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    gap: 10px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 3000;
}

.toast.show {
    transform: translateX(0);
}

.toast-info {
    border-left: 4px solid #667eea;
}

.toast-success {
    border-left: 4px solid #43e97b;
}

.toast-warning {
    border-left: 4px solid #f093fb;
}

.toast-error {
    border-left: 4px solid #f5576c;
}

.user-menu {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.user-menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.user-menu-item:hover {
    background-color: #f0f0f0;
}

.user-menu-divider {
    height: 1px;
    background-color: #e0e0e0;
    margin: 10px 0;
}

.notifications-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.notification-item {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    padding: 15px;
    border-radius: 8px;
    border-left: 4px solid #667eea;
}

.notification-item.info {
    border-left-color: #667eea;
    background-color: #f8f9ff;
}

.notification-item.warning {
    border-left-color: #f093fb;
    background-color: #fff8ff;
}

.notification-item.success {
    border-left-color: #43e97b;
    background-color: #f8fff8;
}

.notification-item.error {
    border-left-color: #f5576c;
    background-color: #fff8f8;
}

.notification-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: #667eea;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 16px;
}

.notification-content h4 {
    margin-bottom: 5px;
    font-size: 14px;
    color: #333;
}

.notification-content p {
    font-size: 13px;
    color: #666;
    margin-bottom: 5px;
}

.notification-content .time {
    font-size: 12px;
    color: #999;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', toastStyles);